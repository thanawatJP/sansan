import React, { useEffect, useState } from 'react';
import ThreadItem from './ThreadItem';
import { UserThreadListApi } from '../store/thread';
import BeatLoader from "react-spinners/BeatLoader";

function PostList() {
    const [threads, setThreads] = useState(null); // สร้าง state เพื่อเก็บข้อมูลผู้ใช้
    const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลด
    const [error, setError] = useState(null); // สร้าง state สำหรับจัดการข้อผิดพลาด
    const user_auth_id = localStorage.getItem('user_auth_id');

    const fetchThreads = async () => {
        UserThreadListApi(user_auth_id)
            .then(response => {
                setThreads(response.data);
                setLoading(false); // ตั้งค่า loading เป็น false
            })
            .catch(err => {
                console.error('Error fetching Threads:', err);
                setError('Failed to load threads');
                setLoading(false); // ตั้งค่า loading เป็น false
            });
    };


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
