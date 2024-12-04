import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ThreadModal from './ThreadModal';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../images/download.webp';
import { userProfileApi } from '../store/user';
import Logo from '../images/Logo.png';

function Header() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user menu dropdown
    const [query, setQuery] = useState('');

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);
    const openRegisterModal = () => setIsRegisterModalOpen(true);
    const closeRegisterModal = () => setIsRegisterModalOpen(false);
    const openThreadModal = () => setIsThreadModalOpen(true);
    const closeThreadModal = () => setIsThreadModalOpen(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedInStatus);
    }, []);

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
        }
    }, []);

    const handleLogout = (event) => {
        event.preventDefault();
        setIsLoggedIn(false);
        localStorage.clear();
        navigate('/');
    }

    const handleInputChange = (e) => {
        setQuery(e.target.value);
      };

    const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
        try {
        // Navigate to search results page with query as URL parameter
        navigate(`/search-results?search=${query}`);
        } catch (error) {
        console.error('Error performing search:', error);
        }
    }
    };

    return (

        <nav className="flex justify-between items-center sticky top-0 z-20 bg-orange-300 p-3"> 
            <Link to="/" className="flex items-center space-x-2 text-brown-600">
                <img src={Logo} alt="Logo" className="h-16 w-16" />
                <div className="text-4xl font-bold text-orange-900 font-serif">SanSan</div>
            </Link>
            <div className="flex items-center space-x-4 sticky top-0">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="ค้นหากระทู้"
                        className="p-2 border rounded-lg focus:outline-none"
                        value={query}
                        onChange={handleInputChange}
                    />
                    <button type="submit" className="bg-orange-300 px-4 py-2 rounded-full">ค้นหา</button>
                </form>
                {!isLoggedIn ? (
                    <>
                        <button onClick={openRegisterModal} className="bg-orange-300 px-4 py-2 rounded-full">สมัครสมาชิก</button>
                        <button onClick={openLoginModal} className="bg-orange-300 px-4 py-2 rounded-full">เข้าสู่ระบบ</button>
                    </>
                ) : (
                    <>
                        <button onClick={openThreadModal} className="bg-orange-300 px-4 py-2 rounded-full">เพิ่มกระทู้</button>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="bg-orange-300 rounded-full p-2 relative"
                        >
                            {/* Replace this with an actual user icon */}
                            <img
                                src={user ? process.env.REACT_APP_API_URL + `${user.profile_picture}` : userIcon}
                                alt={user ? `${user.first_name} ${user.last_name}'s profile` : 'User Icon'}
                                className="h-8 w-8 rounded-full object-cover"
                            />

                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <Link to="/userprofile" className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg>
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                    ออกจากระบบ
                                </button>
                            </div>
                        )}
                    </>
                )}


            </div>
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} openRegisterModal={openRegisterModal} />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} openLoginModal={openLoginModal} />
            <ThreadModal isOpen={isThreadModalOpen} onClose={closeThreadModal} />
        </nav>
    );
}

export default Header;
