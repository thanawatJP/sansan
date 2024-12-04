import React from 'react';
import { useState } from 'react';
import Header from '../components/Header.js';
import Sidebar from '../components/Sidebar.js';
import PostItem from '../components/PostItem.js';
import { useParams } from 'react-router-dom';
import Comment from '../components/Comment.js';

function PostView() {
  const { id } = useParams();
  const [commentText, setCommentText] = useState('');

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };
  
  const handleSendComment = () => {
    // เขียนฟังก์ชันส่งคอมเมนต์ที่นี่
    console.log("ส่งคอมเมนต์:", commentText);
    setCommentText(''); // ล้างข้อความหลังส่ง
  };

  const post = {
    id: 1,
    author: "JohnDoe",
    authorImage: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/291b/live/5899ec60-3055-11ee-8f52-fbf70e4bf742.jpg.webp",
    time: "3 วันที่แล้ว",
    content: "แอปทางรัฐ จะกลายเป็นแอปทางใครทางมันไหมคะ?",
    tags: ["การเมือง", "เทคโนโลยี"],
    image: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/468e/live/187e23c0-ccb9-11ee-a734-b5c4e6ed1081.jpg.webp",
    likes: 1500,
    dislikes: 50,
    comments: 300,
  };
  const comments = [
    {
      id: 1,
      author: "Prayut",
      authorImage: "https://ichef.bbci.co.uk/news/660/cpsprodpb/CD11/production/_103879425_gettyimages-983412224.jpg",
      time: "1 วันที่แล้ว",
      content: "ทางที่ดีให้ผมกลับมาดีกว่า",
      likes: 120,
      dislikes: 2500,
    },
    {
      id: 2,
      author: "Prayut",
      authorImage: "https://ichef.bbci.co.uk/news/660/cpsprodpb/CD11/production/_103879425_gettyimages-983412224.jpg",
      time: "1 วันที่แล้ว",
      content: "ทางที่ดีให้ผมกลับมาดีกว่า",
      likes: 120,
      dislikes: 2500,
    },
    {
      id: 3,
      author: "Prayut",
      authorImage: "https://ichef.bbci.co.uk/news/660/cpsprodpb/CD11/production/_103879425_gettyimages-983412224.jpg",
      time: "1 วันที่แล้ว",
      content: "ทางที่ดีให้ผมกลับมาดีกว่า",
      likes: 120,
      dislikes: 2500,
    },
  ];

  return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col items-center bg-orange-50 p-4 w-full">
              <PostItem key={post.id} post={post} />
              {/* กล่องเขียนคอมเมนต์ */}
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
              {comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

export default PostView;
