import React, { useState } from 'react';
import { registerApi } from '../store/user';
import Swal from 'sweetalert2';

function RegisterModal({ isOpen, onClose, openLoginModal }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [profile_picture, setProfile] = useState(null);
    const [bio, setBio] = useState('');

    if (!isOpen) return null;

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
     
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('bio', bio);
        if (profile_picture) {
            formData.append('profile_picture', profile_picture);
        }
     
        try {
            const response = await registerApi(formData);
            console.log('Response:', response.data);
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'การสมัครสมาชิกเสร็จสมบูรณ์',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถสมัครสมาชิกได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
    };
    
         

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            onClick={handleBackgroundClick}
        >
            <div className="bg-orange-100 w-96 p-8 rounded-lg shadow-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl font-bold text-orange-600">
                    ✖
                </button>
                <h2 className="text-center text-2xl font-bold mb-6">สมัครสมาชิก</h2>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ชื่อผู้ใช้"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <input
                            type="text"
                            id="firstname"
                            value={first_name}
                            onChange={(e) => setFirstname(e.target.value)}
                            placeholder="ชื่อ"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <input
                            type="text"
                            id="lastname"
                            value={last_name}
                            onChange={(e) => setLastname(e.target.value)}
                            placeholder="นามสกุล"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <label className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none">
                            Select image:
                            <input
                                type="file"
                                id="profile"
                                onChange={(e) => setProfile(e.target.files[0])} // ใช้ e.target.files[0]
                                className="mt-2"
                            />
                        </label>
                        <input
                            type="text"
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="คำอธิบาย"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="อีเมล"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="รหัสผ่าน"
                            className="p-3 border border-gray-300 rounded-lg bg-orange-200 focus:outline-none"
                            required
                        />
                        <button type="submit" className="bg-orange-400 text-white py-2 rounded-lg font-bold">สมัครสมาชิก</button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <span>มีบัญชีอยู่แล้ว? </span>
                    <a
                        href="#"
                        className="text-orange-600 font-bold"
                        onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            openLoginModal();
                        }}
                    >
                        เข้าสู่ระบบ
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;
