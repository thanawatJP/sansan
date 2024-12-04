import React, { useState, useEffect } from 'react';
import { userProfileApi, userEditProfileApi } from '../store/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ userProfile }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const userprofileId = localStorage.getItem('userprofile_id');
    const navigate = useNavigate();

    // useEffect เพื่อกำหนดค่าเริ่มต้นจาก props
    useEffect(() => {
        if (userProfile) {
            setFirstname(userProfile.firstname);
            setLastname(userProfile.lastname);
            setBio(userProfile.description);
            setPreview(userProfile.profilePicture);
        }
    }, [userProfile]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('first_name', firstname);
        formData.append('last_name', lastname);
        formData.append('bio', bio);
        // if (userProfile && userProfile.profilePicture) {
        //     formData.append('old_img', userProfile.profilePicture);
        // }
        if (image) {
            formData.append('profile_picture', image);
        }

        try {
            // เรียก API เพื่ออัปเดตโปรไฟล์
            await userEditProfileApi(userprofileId, formData);
            // นำข้อมูลที่อัปเดตมาแสดงใหม่
            const updatedData = await userProfileApi(userprofileId);
            console.log('Updated user profile:', updatedData.data);

            await Swal.fire({
                title: 'แก้ไขสำเร็จ!',
                text: 'ระบบได้ทำการแก้ไขข้อมูลสำเร็จ',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                // window.location.reload();
                navigate('/');
            });

        } catch (error) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'อาจเป็นเพราะใจเธอไม่เหมือนเดิม',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="w-2/5 mx-auto p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="profileImage" className="block mb-2 text-sm font-medium text-gray-700">
                        Upload Image
                    </label>
                    <div className="flex items-center">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mr-4"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="profileImage"
                            className="px-4 py-2 bg-orange-300 text-white rounded cursor-pointer hover:bg-orange-500"
                        >
                            Choose File
                        </label>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-700">
                        Firstname
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-700">
                        Lastname
                    </label>
                    <input
                        type="text"
                        id="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-700">
                        Bio
                    </label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-orange-300 text-white rounded hover:bg-orange-500 transition duration-200"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
