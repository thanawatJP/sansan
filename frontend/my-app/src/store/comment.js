import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const CommentListApi = async (thread_id) => {
  try {
      // Prepare headers based on user authentication status
      const headers = {
        'Content-Type': 'application/json'
      };

      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await api.get(`/api/blog/comments/${thread_id}/`, { headers });
      return response;
  } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
  }
};

export const CommentCreateApi = async ( thread_id, formData ) => {
  try {
      const response = await api.post(`/api/blog/comment/${thread_id}/`, formData, {
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

export const CommentEditApi = async ( comment_id, formData ) => {
  try {
      const response = await api.put(`/api/blog/comment/${comment_id}/`, formData, {
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

export const CommentDeleteApi = async ( comment_id ) => {
  try {
      const response = await api.delete(`/api/blog/comment/${comment_id}/`, {
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

export const LikeDislikeApi = async ( comment_id, formData ) => {
  try {
      const response = await api.post(`/api/blog/comment/like/${comment_id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
      });
      return response;
  }
  catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};