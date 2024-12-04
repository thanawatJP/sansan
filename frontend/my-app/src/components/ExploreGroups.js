import React, { useEffect, useState } from 'react';
import { ExploreThreadApi, SubscribeThreadApi } from '../store/thread';
import { BeatLoader } from 'react-spinners';

function ExploreGroups() {
    const [subCategories, setSubCategories] = useState([]);
    const [unsubCategories, setUnsubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        ExploreThreadApi()
            .then(response => {
                setSubCategories(response.data.sub_categories); // ตั้งค่าหมวดหมู่ที่ติดตาม
                setUnsubCategories(response.data.unsub_categories); // ตั้งค่าหมวดหมู่ที่ไม่ได้ติดตาม
                setLoading(false); // ตั้งค่า loading เป็น false
            })
            .catch(err => {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
                setLoading(false); // ตั้งค่า loading เป็น false
            });
    }, []);

    // ฟังก์ชันสำหรับติดตามหรือยกเลิกการติดตามหมวดหมู่
    const toggleFollow = async (category) => {
        try {
            await SubscribeThreadApi(category.id); // เรียก API เพื่อ subscribe/unsubscribe
            if (subCategories.find(cat => cat.id === category.id)) {
                // ถ้าอยู่ใน subCategories ก็ยกเลิกการติดตาม
                setSubCategories(subCategories.filter(cat => cat.id !== category.id));
                setUnsubCategories([...unsubCategories, category]); // เพิ่มลง unsubCategories
            } else {
                // ถ้าไม่อยู่ใน subCategories ก็ทำการติดตาม
                setUnsubCategories(unsubCategories.filter(cat => cat.id !== category.id));
                setSubCategories([...subCategories, category]); // เพิ่มลง subCategories
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            // คุณอาจต้องการแสดงข้อผิดพลาดให้กับผู้ใช้ที่นี่
        }
    };

    // แสดง loading หรือ error message
    if (loading) {
        return (
            <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-full h-auto">
                <BeatLoader color="#Fdba74" size={25} />
            </div>
        );
    }
    if (error) return <div>{error}</div>;

    return (
        <div className="p-8 bg-orange-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">สำรวจกลุ่ม</h2>
            <hr className="border-t-4 border-orange-200 my-4" />
            <br />

            <h2 className="text-xl font-bold mb-6">แท็กที่คุณติดตาม</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {subCategories.map(category => (
                    <div className="tag-item bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105" key={category.id}>
                        <img src={process.env.REACT_APP_API_URL + `${category.picture}`} alt={category.name} className="h-32 w-full object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                            <button
                                onClick={() => toggleFollow(category)} // เรียกใช้ toggleFollow เมื่อคลิกปุ่ม
                                className="px-4 py-2 rounded-full bg-green-500 text-white"
                            >
                                กำลังติดตาม
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <hr className="border-t-4 border-orange-200 my-4" />
            <br />
            <h2 className="text-xl font-bold mb-6">แท็กที่คุณยังไม่ได้ติดตาม</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {unsubCategories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
                    >
                        <img src={process.env.REACT_APP_API_URL + `${category.picture}`} alt={category.name} className="h-32 w-full object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                            <button
                                onClick={() => toggleFollow(category)} // เรียกใช้ toggleFollow เมื่อคลิกปุ่ม
                                className="px-4 py-2 rounded-full bg-blue-500 text-white"
                            >
                                ติดตาม
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default ExploreGroups;
