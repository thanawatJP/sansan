import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineUpdate, MdMoreHoriz, MdFlag, MdDelete, MdEdit } from "react-icons/md";
import { FcLike   } from "react-icons/fc";
import { RiDislikeLine } from "react-icons/ri";
import { FaRegCommentDots } from "react-icons/fa";
import Swal from 'sweetalert2';
import { UserThreadDeleteApi } from '../store/thread';
import EditThreadModal from './EditThreadModal';
import { likeAPI, SearchByCategoryApi } from '../store/thread';
import LoginModal from './LoginModal';

function ThreadItem({ thread, fetchThreads }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user_auth_id = localStorage.getItem('user_auth_id');
  const [isEditThreadModalOpen, setIsEditThreadModalOpen] = useState(false);

  const openEditThreadModal = () => setIsEditThreadModalOpen(true);
  const closeEditThreadModal = () => setIsEditThreadModalOpen(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [Like, setLike] = useState(thread.reacted);
  const [like, setLike] = useState(null);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    if (thread.reacted === true) {
      setLike(true);
    } else if (thread.reacted === false) {
      setLike(false);
    }
  }, [thread.reacted]);

  const handleButtonClick = (id) => {
    navigate(`/thread/${id}/`);
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleEditPost = () => {
    if (user_auth_id === String(thread.author.id)) {
      openEditThreadModal();
    } else {
      Swal.fire({
        title: 'ไม่อนุญาต',
        text: 'คุณไม่มีสิทธิ์แก้ไขโพสต์นี้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleDeletePost = async () => {
    if (user_auth_id === String(thread.author.id)) {
      try {
        const result = await Swal.fire({
          title: 'คุณแน่ใจหรือไม่?',
          text: 'คุณไม่สามารถกู้คืนโพสต์นี้ได้หลังจากลบ',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ใช่, ลบเลย!',
          cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
          const response = await UserThreadDeleteApi(thread.id);
          Swal.fire({
            title: 'ลบสำเร็จ!',
            text: 'โพสต์ถูกลบแล้ว',
            icon: 'success',
            confirmButtonText: 'ตกลง',
          });
          console.log('Deleted Thread:', response.data);
          fetchThreads(); // โหลดข้อมูลใหม่เมื่อลบโพสต์สำเร็จ
        }
      } catch (error) {
        console.error('Error deleting thread:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบโพสต์ได้',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    } else {
      Swal.fire({
        title: 'ไม่อนุญาต',
        text: 'คุณไม่มีสิทธิ์ลบโพสต์นี้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  const isLoggedin = localStorage.getItem('accessToken');

const handleLikeDislike = (isLike) => async () => {

  if (isLike === like) {
    setLike(null);
  }

  // ใช้ API สำหรับการกดไลค์หรือดิสไลค์คอมเมนต์
  try {
    await likeAPI(thread.id, { "like": isLike });
    await fetchThreads();
  } catch (error) {
    console.error('Error liking/disliking comment:', error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      text: 'ไม่สามารถกดไลค์หรือดิสไลค์คอมเมนต์ได้ในขณะนี้',
      icon: 'error',
      confirmButtonText: 'ตกลง'
    });
  }
}

const handleCategoryClick = async (category_id) => {
  try {
    navigate(`/search-results/categories/${category_id}/`);
  } catch (error) {
    console.error('Error fetching threads by category:', error);
  }
};

  return (
    <div className="p-4 w-2/3 border-b-2 border-yellow-900">
      <div className="flex items-center space-x-2 text-brown-600">
        <div className="flex w-4/5">
          <img src={process.env.REACT_APP_API_URL + `${thread.author.image}`} alt="Author" className="w-16 h-16 rounded-full object-cover" />
          <div className="p-2 w-full">
            <div className="flex gap-2 w-full flex-nowrap overflow-x-auto">
                {thread.categories.map((category, index) => (
                <button
                    key={index}
                    onClick={() => handleCategoryClick(category.id)}
                    className="bg-orange-200 rounded-xl shadow-md px-4 py-1 text-lg whitespace-nowrap cursor-pointer"
                >
                    {category.name}
                </button>
                ))}
            </div>
            <div className="flex p-2 opacity-50">
              <MdOutlineUpdate size="1.5rem"/> 
              <span className="ml-2">{thread.created}</span>
            </div>
          </div>
        </div>

        {/* ใช้เฉพาะตอน User Profile */}
        { user_auth_id === String(thread.author.id) && (
        <div className="w-1/5 text-right relative">
          <button onClick={toggleMenu} className="cursor-pointer px-2 rounded-md hover:bg-orange-100">
            <MdMoreHoriz size="1.5rem" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md border rounded-lg">
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-md border rounded-lg">
                <button
                  className="flex space-x-2 items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleEditPost}
                >
                  <MdEdit size="1.5rem" className="text-orange-300" />
                  <span>แก้ไข</span>
                </button>
                <button
                  className="flex space-x-2 items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleDeletePost}
                >
                  <MdDelete size="1.5rem" className="text-orange-500" />
                  <span>ลบ</span>
                </button>
                <button
                  className="flex space-x-2 items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert("รายงานโพสต์")}
                >
                  <MdFlag size="1.5rem" className="text-red-500" />
                  <span>รายงาน</span>
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
      <p className="text-2xl text-gray-800 mb-2">{thread.content}</p>
      {thread.image && (
        <img src={ process.env.REACT_APP_API_URL +`${thread.image}`} alt="thread" className="w-full h-auto rounded-lg mt-2" />
      )}
      <div className="flex gap-2 w-full flex-nowrap p-2 mt-2">
        {isLoggedin ? (
          <>
            <button onClick={handleLikeDislike(true)} className={`flex items-center ${
            like === true ? 'bg-green-300 text-white hover:bg-slate-300' : 'bg-orange-200 hover:bg-green-300'} rounded-2xl shadow-lg px-4 py-1 text-lg`}>
              <FcLike className="mr-2" />{thread.likes}</button>
            <button onClick={handleLikeDislike(false)} className={`flex items-center ${
            like === false ? 'bg-blue-300 text-white hover:bg-slate-300'  : 'bg-orange-200 hover:bg-blue-300 '} rounded-2xl shadow-lg px-4 py-1 text-lg`}>
              <RiDislikeLine className="mr-2" />{thread.dislikes}</button>
          </>
        ) : (
          <>
            <button onClick={openLoginModal} className="flex items-center bg-orange-200 hover:bg-red-300 rounded-2xl shadow-lg px-4 py-1 text-lg"><FcLike className="mr-2" />{thread.likes}</button>
            <button onClick={openLoginModal} className="flex items-center bg-orange-200 hover:bg-red-300 rounded-2xl shadow-lg px-4 py-1 text-lg"><RiDislikeLine className="mr-2" />{thread.dislikes}</button>
          </>
        )}
        <button onClick={() => handleButtonClick(thread.id)} className="flex items-center bg-orange-200 hover:bg-orange-300 rounded-2xl shadow-lg px-4 py-1 text-lg"><FaRegCommentDots className="mr-2" />{thread.comments}</button>
      </div>
      <EditThreadModal
        isOpen={isEditThreadModalOpen}
        onClose={closeEditThreadModal}
        thread={thread} // ส่ง thread เข้าไปในโมดอล
        fetchThreads={fetchThreads} // ส่งฟังก์ชัน fetchThreads เข้าไปในโมดอล
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default ThreadItem;
