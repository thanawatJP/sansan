import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { userProfileApi } from '../store/user';
import { BeatLoader } from 'react-spinners';

function UserProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // สร้าง state เพื่อเก็บข้อมูลผู้ใช้
    const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลด
    const [error, setError] = useState(null); // สร้าง state สำหรับจัดการข้อผิดพลาด

    useEffect(() => {
        // ดึง userprofile_id จาก localStorage
        const userprofileId = localStorage.getItem('userprofile_id');
        if (userprofileId) {
            // เรียกใช้ API เพื่อนำข้อมูลผู้ใช้มาแสดง
            userProfileApi(userprofileId)
                .then(response => {
                    setUser(response.data); // ตั้งค่า user จากข้อมูลที่ได้จาก API
                    setLoading(false); // ตั้งค่า loading เป็น false
                })
                .catch(err => {
                    console.error('Error fetching user profile:', err);
                    setError('Failed to load user profile');
                    setLoading(false); // ตั้งค่า loading เป็น false
                });
        } else {
            navigate('/')
        }
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
        <div className="bg-orange-50">
            <div className='p-5 flex border shadow-md overflow-hidden justify-center'>
                <div className="w-1/3 flex justify-center items-center">
                    <img
                        src={process.env.REACT_APP_API_URL + `${user.profile_picture}`}
                        alt={`${user.first_name} ${user.last_name}'s profile`}
                        className="w-48 h-48 rounded-full object-cover"
                    />
                </div>

                <div className="w-1/3 p-4 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.first_name} {user.last_name}
                        </h2>
                        <div className="w-1/3 p-4 flex flex-col justify-center">
                            <Link to="/editprofile" className="bg-orange-300 py-1 px-3 rounded-lg text-sm text-center">
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-600">{user.bio}</p>
                    <strong>
                        <a className="mt-2 text-gray-600 flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            Mylink
                        </a>
                    </strong>
                </div>
            </div>
            <div className="w-full p-4 flex justify-center">
                <button className="bg-orange-300 py-1 px-3 rounded-lg text-lg">
                    My Post
                </button>
            </div>
        </div>
    );
}



export default UserProfile;
