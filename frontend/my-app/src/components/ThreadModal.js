import React, { useState, useEffect } from 'react';
import { CategoryThreadApi, UserThreadApi } from '../store/thread';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function PostForm({ isOpen, onClose }) {
    const [content, setContent] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [tags, setTags] = useState([]);
    const [files, setFiles] = useState([]);
    const [categories, setCategories] = useState(null);
    const user_auth_id = localStorage.getItem('user_auth_id');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryThreadApi();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const handleAddTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag('');
        }
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('author', user_auth_id);
            formData.append('content', content);
            tags.forEach((tag) => {
                formData.append('categories', tag);
            });

            if (files.length > 0) {
                files.forEach((file) => {
                    formData.append('image', file);
                });
            }

            const response = await UserThreadApi(formData);
            console.log('Thread submitted successfully:', response);
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'ได้ทำการสร้าง Thread แล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                navigate('/');
                window.location.reload();
            });
        } catch (error) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถสร้าง Thread ได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            console.error('Error submitting to thread:', error);
        }
    };

    if (!isOpen) return null;

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
            onClick={handleBackgroundClick}
        >
            <div className="bg-orange-100 w-96 p-8 rounded-lg shadow-lg relative">
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="content">รายละเอียด</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="tags">แท็ก</label>
                        <select
                            id="tags"
                            value={selectedTag}
                            onChange={handleTagChange}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option value="">เลือกแท็ก</option>
                            {categories && categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="mt-2 bg-green-500 text-white py-1 px-2 rounded-lg"
                        >
                            เพิ่มแท็ก
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-bold">แท็กที่เลือก:</h3>
                        <ul>
                            {tags.map((tag, index) => (
                                <li key={index}>{categories.find(cat => String(cat.id) === tag)?.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="files">เพิ่มรูปภาพ/วิดีโอ</label>
                        <input
                            type="file"
                            id="files"
                            onChange={handleFileChange}
                            className="mt-2"
                            multiple
                        />
                        <div className="mt-4">
                            <h3 className="font-bold">ไฟล์ที่เลือก:</h3>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                        ตั้งกระทู้
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded-lg ml-4">
                        ยกเลิก
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PostForm;
