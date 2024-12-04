// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const ThreadListApi = async () => {
  try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
      }
      const response = await api.get(`api/blog/home/`, { headers });
      return response;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};

export const CategoryThreadApi = async () => {
  try {
      const response = await api.get(`api/blog/category/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
  } catch (error) {
    console.error('Error GET data:', error);
    throw error;
  }
};

export const UserThreadApi = async (formData) => {
  try {
      const response = await api.post(`api/blog/thread/`, formData, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'multipart/form-data',
          },
      });
      return response;
  } catch (error) {
      console.error('Error submitting to thread:', error);
      throw error;
  }
};

export const UserThreadListApi = async (user_auth_id) => {
  try {
      const response = await api.get(`api/blog/mythread/${user_auth_id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
      });
      return response;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};

export const UserThreadEditApi = async (thread_id, updatedData) => {
  try {
      const response = await api.put(`api/blog/mythread/edit/${thread_id}/`, updatedData, {
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

export const ThreadDetailApi = async ( thread_id ) => {
  try {
      const response = await api.get(`/api/blog/thread/${thread_id}/`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return response;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};

export const UserThreadDeleteApi = async (thread_id) => {
  try {
      const response = await api.delete(`api/blog/mythread/delete/${thread_id}/`, {
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

export const ExploreThreadApi = async () => {
  try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
      const response = await api.get('api/blog/subscribe/', { headers });
      return response;
  } catch (error) {
    console.error('Error GET data:', error);
    throw error;
  }
};

export const SubscribeThreadApi = async (category_id) => {
  try {
      const response = await api.put(`api/blog/subscribe/${category_id}/`, null, { // ใช้ null แทนข้อมูล body
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
  } catch (error) {
    console.error('Error GET data:', error);
    throw error;
  }
};

export const likeAPI = async (thread_id, data) => {
  try {
    const response = await api.post(`api/blog/threads/reacts/${thread_id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    console.log('Liking response:', response.data);
    return response;
  } catch (error) {
    console.error('Error liking:', error);
    throw error;
  }
};

export const SearchThreadsApi = async (query) => {
  try {
    const response = await api.get(`api/blog/search-results?search=${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error searching threads:', error);
    throw error;
  }
};

export const SearchByCategoryApi = async (category_id) => {
  try {
      const response = await api.get(`api/blog/search-results/categories/${category_id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};
