import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar.js';
import EditProfile from '../components/edituserprofile.js';
import userIcon from '../images/download.webp';
import { userProfileApi } from '../store/user';

function EditProfileView() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userprofileId = localStorage.getItem('userprofile_id');
    if (userprofileId) {
      userProfileApi(userprofileId)
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user profile:', err);
          setError('Failed to load user profile');
          setLoading(false);
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data found.</div>;

  const userData = {
    firstname: user.first_name,
    lastname: user.last_name,
    description: user.bio || "No description available",
    profilePicture: user.profile_picture ? process.env.REACT_APP_API_URL + `${user.profile_picture}` : userIcon
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <EditProfile userProfile={userData} />
        </div>
      </div>
    </div>
  );
}

export default EditProfileView;
