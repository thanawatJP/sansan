import React, { useEffect, useState } from 'react';
import Header from '../components/Header.js';
import Sidebar from '../components/Sidebar.js';
import ThreadItem from '../components/ThreadItem.js';
import { useParams} from 'react-router-dom';
import Comment from '../components/Comment.js';
import { ThreadDetailApi } from '../store/thread.js';
import { CommentListApi, CommentCreateApi } from '../store/comment.js';
import Swal from 'sweetalert2';
import { BeatLoader } from 'react-spinners';

function ThreadView() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comments, setComments] = useState([]); // สร้าง state เพื่อเก็บข้อมูลผู้ใช้
  const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลด
  const [error, setError] = useState(null); // สร้าง state สำหรับจัดการข้อผิดพลาด
  const [commentText, setCommentText] = useState('');

  const fetchThread = async () => {
    ThreadDetailApi(id)
        .then(response => {
            setThread(response.data);
            console.log('Thread:', response.data);
            setLoading(false); // ตั้งค่า loading เป็น false
        })
        .catch(err => {
            console.error('Error fetching Thread:', err);
            setError('Failed to load Thread');
            setLoading(false); // ตั้งค่า loading เป็น false
        });
  };

  const fetchComments = async () => {
    CommentListApi(id)
        .then(response => {
            setComments(response.data);
            console.log('Comments:', response.data);
            setLoading(false); // ตั้งค่า loading เป็น false
        })
        .catch(err => {
            console.error('Error fetching Comments:', err);
            setError('Failed to load Comments');
            setLoading(false); // ตั้งค่า loading เป็น false
        });
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  useEffect(() => {
    fetchThread();
    fetchComments();
  }, []);

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };
  
  const handleSendComment = async () => {
    // เขียนฟังก์ชันส่งคอมเมนต์ที่นี่
    // console.log("ส่งคอมเมนต์:", commentText);
    const formData = new FormData();
    formData.append('content', commentText);

    try {
      // เรียก API เพื่อสร้างคอมเมนต์
      await CommentCreateApi(id, formData);

      await Swal.fire({
        title: 'สำเร็จ!',
        text: 'ระบบได้ทำการส่งคอมเมนต์สำเร็จ',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
      fetchThread();
      fetchComments();
      setCommentText('');

    } catch (error) {
      console.error('Error sending comment:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถส่งคอมเมนต์ได้ในขณะนี้',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  // แสดงข้อความระหว่างโหลดหรือข้อผิดพลาด
  if (loading) {
    return (
        <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-full h-auto">
            <BeatLoader color="#Fdba74" size={25} />
        </div>
    );
  }
  if (error) return <p>{error}</p>;

  // ถ้ามี `thread` ใน state, ใช้งานได้เลย
  if (thread) {
  return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-screen h-auto">
              <ThreadItem key={thread.id} thread={thread} />
              {isLoggedIn && (
              <div className="relative items-center w-2/3 mt-4">
                  <textarea
                      className="w-full p-2 pr-16 border border-gray-300 rounded-2xl resize-none"
                      rows="3"
                      placeholder="เขียนคอมเมนต์ที่นี่..."
                      value={commentText}
                      onChange={handleInputChange}
                  />
                  <button
                      className={`absolute bottom-4 right-2 px-4 py-1 bg-orange-500 text-white rounded-2xl shadow-md ${
                          commentText.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
                      }`}
                      onClick={handleSendComment}
                      disabled={commentText.trim() === ''}
                  >
                      ส่ง
                  </button>
              </div>
              )}
              {comments.length > 0 ? (
                  comments.map((comment) => (
                      <Comment key={comment.id} comment={comment} fetchComments={fetchComments} fetchThread={fetchThread} isLoggedIn={isLoggedIn}/>
                  ))
              ) : (
                  <h2 className="text-2xl">ยังไม่มีความคิดเห็น</h2>
              )}
            </div>
          </div>
        </div>
      </div>
  );}
}

export default ThreadView;
