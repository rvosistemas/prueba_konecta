import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getEmployeesService = async (token, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/employees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employees ', error);
    throw new Error('Failed to fetch employees');
  }
};
