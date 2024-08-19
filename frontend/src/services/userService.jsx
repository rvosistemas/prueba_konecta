import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getUsersService = async (token, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const getUserByIdService = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

export const createUserService = async (token, username, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/users`, {
      username,
      email,
      password,
      role,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      throw new Error('No response from server. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

export const updateUserService = async (token, id, username, email, password, role) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, {
      username,
      email,
      password,
      role,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Edit failed');
    } else if (error.request) {
      throw new Error('No response from server. Please try again later.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};
