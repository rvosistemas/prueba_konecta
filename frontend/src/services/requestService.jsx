import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getRequestsService = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch requests');
  }
};
