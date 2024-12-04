// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ฟังก์ชันสำหรับการลงทะเบียน
export const registerApi = async (userData) => {
  try {
    const response = await api.post('/api/user/register/', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const loginApi = async (userData) => {
    try {
        const response = await api.post('/api/user/login/', userData, {
            headers: {
              'Content-Type': 'application/json',
            },
        });
        console.log('Login successful', response.data);  // แสดงข้อมูล response
        return response;
    } catch (error) {
      console.error('Error login:', error);
      throw error;
    }
  };

export const userProfileApi = async (userData) => {
    try {
        const response = await api.get(`/api/user/profile/${userData}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });
        return response;
    } catch (error) {
      console.error('Error login:', error);
      throw error;
    }
  };

export const userEditProfileApi = async (userprofileId, formData) => {
  try {
      const response = await api.put(`/api/user/profile/${userprofileId}`, formData, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Profile updated:', response.data);
      return response;
  } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
  }
};


api.interceptors.response.use(
  (response) => response, // ถ้าคำขอสำเร็จ ให้ส่ง response กลับไปตามปกติ
  async (error) => {
    if (error.response && error.response.status === 401) { // ตรวจสอบสถานะ 401 Unauthorized
      try {
        // ใช้ Refresh Token เพื่อขอ Access Token ใหม่
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshResponse = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          
          // อัปเดต Access Token ใหม่ใน localStorage
          localStorage.setItem('accessToken', refreshResponse.data.access);

          // ตั้งค่า header ใหม่และส่งคำขออีกครั้ง
          error.config.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);
        // ถ้า Refresh Token หมดอายุหรือล้มเหลว ให้ลบ Token ออกจาก localStorage และเปลี่ยนเส้นทางไปที่หน้า login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);