import React, { useState, useEffect } from 'react';
import { UserThreadEditApi, CategoryThreadApi } from '../store/thread';
import Swal from 'sweetalert2';

function EditThreadModal({ isOpen, onClose, thread, fetchThreads }) {
  const [content, setContent] = useState('');
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (thread) {
      setContent(thread.content);
      setSelectedCategories(thread.categories.map(cat => cat.id)); // แปลงเป็น array ของ id
    }

    // ดึงข้อมูลหมวดหมู่ทั้งหมด
    const fetchCategories = async () => {
      try {
        const response = await CategoryThreadApi();
        setAllCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [thread]);

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      // ลบ category ถ้ามีอยู่แล้ว
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      // เพิ่ม category ถ้ายังไม่มี
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        content,
        categories: selectedCategories,
      };
      console.log("test", updatedData)
      const response = await UserThreadEditApi(thread.id, updatedData);
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'โพสต์ได้รับการแก้ไขแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      console.log('Updated Thread:', response.data);
      onClose(); // ปิดโมดอลหลังจากแก้ไขเสร็จ
      fetchThreads(); // โหลดข้อมูลใหม่เมื่อแก้ไขโพสต์สำเร็จ
    } catch (error) {
      console.error('Error updating thread:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถแก้ไขโพสต์ได้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white w-96 p-8 rounded-lg shadow-lg relative">
        <h2 className="text-2xl mb-4">แก้ไขโพสต์</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          rows="4"
        />

        <div className="mb-4">
          <h3 className="font-bold">เลือกหมวดหมู่:</h3>
          <div className="max-h-40 overflow-y-scroll">
            {allCategories.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <span className="ml-2">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mr-2"
        >
          บันทึกการเปลี่ยนแปลง
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}

export default EditThreadModal;
