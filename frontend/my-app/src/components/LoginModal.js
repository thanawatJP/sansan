import React, { useState } from 'react';
import { loginApi } from '../store/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function LoginModal({ isOpen, onClose, openRegisterModal }) {

    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;

    // ฟังก์ชันจัดการคลิกที่พื้นหลัง
    const handleBackgroundClick = (event) => {
        // ตรวจสอบว่าคลิกเกิดขึ้นที่พื้นหลัง ไม่ใช่ที่ modal
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', emailOrUsername);
        formData.append('password', password);

        try {
            const response = await loginApi(formData);
            console.log('Response:', response.data);

            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('user_auth_id', response.data.user_auth_id);
            localStorage.setItem('userprofile_id', response.data.userprofile_id);
            localStorage.setItem('isLoggedIn', true);

            await Swal.fire({
                title: 'ล็อคอินสำเร็จ!',
                text: 'เข้าสู่ระบบสำเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'ERROR LOGIN',
                text: 'username หรือ password ผิด',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
        // Handle form submission logic here (e.g., send data to API)
        console.log({ emailOrUsername, password });
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            onClick={handleBackgroundClick} // เพิ่มการจัดการคลิกที่พื้นหลัง
        >
            <div className="bg-orange-100 w-96 p-8 rounded-lg shadow-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold text-orange-600">
                    ✖
                </button>
                <h2 className="text-center text-2xl font-bold mb-6">ลงชื่อเข้าใช้งาน</h2>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            id="emailOrUsername"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            placeholder="ชื่อผู้ใช้ / อีเมล"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <input
                            type="password"
                            id="password"
                            placeholder="รหัสผ่าน"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <a href="#" className="text-right text-orange-600 text-sm">ลืมรหัสผ่าน</a>
                        <button type="submit" className="bg-orange-400 text-white py-2 rounded-lg font-bold">เข้าสู่ระบบ</button>
                    </div>
                </form>


                <div className="mt-6 text-center">
                    <span>มาใหม่? </span>
                    <a
                        href="#"
                        className="text-orange-600 font-bold"
                        onClick={(e) => {
                            e.preventDefault(); // ป้องกันการกระโดดไปยังลิงก์
                            onClose(); // ปิด modal นี้
                            openRegisterModal(); // เปิด modal สำหรับการสมัครสมาชิก
                        }}
                    >
                        สมัครสมาชิก
                    </a>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
