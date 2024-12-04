import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineUpdate, MdMoreHoriz, MdFlag, MdDelete, MdEdit } from "react-icons/md";
import { FcLike   } from "react-icons/fc";
import { RiDislikeLine } from "react-icons/ri";
import { CommentEditApi, CommentDeleteApi, LikeDislikeApi } from '../store/comment';
import Swal from 'sweetalert2';
import LoginModal from './LoginModal';

function Comment({ comment, fetchComments, fetchThread, isLoggedIn }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const userprofileId = localStorage.getItem('userprofile_id');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [like, setLike] = useState(null);

  // Set the initial like state based on user_reaction when the component mounts
  useEffect(() => {
    if (comment.user_reaction === true) {
      setLike(true);
    } else if (comment.user_reaction === false) {
      setLike(false);
    }
  }, [comment.user_reaction]);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleEditComment = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = async () => {
    // Function to save edited content (e.g., make API call here)
    const formData = new FormData();
    formData.append('content', editedContent);

    // ใช้ API สำหรับแก้ไขคอมเมนต์
    try {
      await CommentEditApi(comment.id, formData);

      await Swal.fire({
        title: 'แก้ไขสำเร็จ!',
        text: 'ระบบได้ทำการแก้ไขคอมเมนต์สำเร็จ',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
      await fetchComments();
    } catch (error) {
      console.error('Error saving comment:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถแก้ไขคอมเมนต์ได้ในขณะนี้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
    // After saving, exit editing mode
    setIsEditing(false);
  };

  const handleDeleteComment = async () => {
    // Function to delete comment (e.g., make API call here)
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณไม่สามารถกู้คืนคอมเมนต์นี้ได้หลังจากลบ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
      });

      if (!result.isConfirmed) {
        return; // Exit the function if the user clicks Cancel
      }
      await CommentDeleteApi(comment.id);
      await Swal.fire({
        title: 'ลบสำเร็จ!',
        text: 'ระบบได้ทำการลบคอมเมนต์สำเร็จ',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
      await fetchThread();
      await fetchComments();

    } catch (error) {
      console.error('Error deleting comment:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถลบคอมเมนต์ได้ในขณะนี้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleLikeDislike = (isLike) => async () => {

    if (!isLoggedIn) {
      // Open the login modal if the user is not logged in
      Swal.fire({
          title: 'กรุณาเข้าสู่ระบบ',
          text: 'คุณต้องเข้าสู่ระบบก่อนที่จะกดไลค์หรือดิสไลค์',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
          // Optionally provide a link to the login page or modal
      });
      return; // Exit the function
    }

    if (isLike === like) {
      setLike(null);
    }

    // ใช้ API สำหรับการกดไลค์หรือดิสไลค์คอมเมนต์
    try {
      await LikeDislikeApi(comment.id, { is_like: isLike });
      await fetchComments();
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

  return (
    <div className="p-4 w-2/3">
      <div className="flex items-center space-x-2 text-brown-600">
        <div className="flex items-center w-4/5">
          <img src={process.env.REACT_APP_API_URL + `${comment.author.image}`} alt="Author" className="w-12 h-12 rounded-full object-cover" />
          <div className="flex p-2">
            <span className="ml-2 text-xl font-semibold">{comment.author.name}</span>
            <div className="flex p-1 opacity-50">
              <MdOutlineUpdate size="1.5rem"/>
              <span className="ml-1">{comment.created}</span>
            </div>
          </div>
        </div>
        {/* ใช้เฉพาะตอน Comment ของตัวเอง */}
        { comment.author.id === parseInt(userprofileId) && (
        <div className="w-1/5 text-right relative">
          <button onClick={toggleMenu} className="cursor-pointer px-2 rounded-md hover:bg-orange-100">
            <MdMoreHoriz size="1.5rem" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md border rounded-lg">
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-md border rounded-lg">
                <button className="flex space-x-2 items-center w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleEditComment()}>
                  <MdEdit size="1.5rem" className='text-orange-300' />
                  <span>แก้ไข</span>
                </button>
                <button className="flex space-x-2 items-center w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => handleDeleteComment()}>
                  <MdDelete size="1.5rem" className='text-orange-500'/>
                  <span>ลบ</span>
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {isEditing ? (
        <div className="relative items-center w-full mt-4">
          <textarea
              className="w-full p-2 pr-16 border border-gray-300 rounded-2xl resize-none"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
          />
          <button
              className={`absolute bottom-4 right-2 px-4 py-1 bg-orange-500 text-white rounded-2xl shadow-md ${
                editedContent.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
              }`}
              onClick={handleSaveEdit}
              disabled={editedContent.trim() === ''}
          >
              บันทึก
          </button>
          <button
              className="absolute bottom-4 right-20 mr-2 px-4 py-1 bg-red-500 text-white rounded-2xl shadow-md"
              onClick={() => setIsEditing(false)}
          >
              ยกเลิก
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-800 mb-2">{comment.content}</p>
      )}
      <div className="flex gap-2 w-full flex-nowrap p-1 text-sm">
        <button
          className={`flex items-center rounded-2xl shadow-md px-4 py-1 ${
            like === true ? 'bg-green-300 text-white hover:bg-slate-300' : 'bg-orange-200 hover:bg-green-300'
          }`}
          onClick={handleLikeDislike(true)}
        >
          <FcLike className="mr-2" />
          {comment.likes}
        </button>
        
        <button
          className={`flex items-center rounded-2xl shadow-md px-4 py-1 ${
            like === false ? 'bg-blue-300 text-white hover:bg-slate-300'  : 'bg-orange-200 hover:bg-blue-300'
          }`}
          onClick={handleLikeDislike(false)}
        >
          <RiDislikeLine className="mr-2" />
          {comment.dislikes}
        </button>
      </div>
    </div>
  );
}

export default Comment;
