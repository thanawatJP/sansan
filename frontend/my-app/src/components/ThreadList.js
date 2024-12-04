import React, { useEffect, useState } from 'react';
import ThreadItem from './ThreadItem';
import { ThreadListApi } from '../store/thread';
import BeatLoader from "react-spinners/BeatLoader";

function PostList() {
    const [threads, setThreads] = useState(null); // สร้าง state เพื่อเก็บข้อมูลผู้ใช้
    const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลด
    const [error, setError] = useState(null); // สร้าง state สำหรับจัดการข้อผิดพลาด

    const fetchThreads = async () => {
        ThreadListApi()
            .then(response => {
                setThreads(response.data);
                console.log(response.data);
                setLoading(false); // ตั้งค่า loading เป็น false
                console.log(response.data)
            })
            .catch(err => {
                console.error('Error fetching Threads:', err);
                setError('Failed to load threads');
                setLoading(false); // ตั้งค่า loading เป็น false
            });
    }

    useEffect(() => {
        fetchThreads();
    }, []);

    // แสดงข้อความระหว่างโหลดหรือข้อผิดพลาด
    if (loading) {
        return (
            <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-full h-auto">
                <BeatLoader color="#Fdba74" size={25} />
            </div>
        );
    }
    // if (loading) return <PuffLoader className="bg-orange-100" />;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-full h-auto">
            {threads.length > 0 ? (
                threads.map((thread) => (
                    <ThreadItem key={thread.id} thread={thread} fetchThreads={fetchThreads} />
                ))
            ) : (
                <h2 className="text-2xl">ยังไม่มีกระทู้</h2>
            )}
        </div>
    );
}

export default PostList;
