import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getRequestsService = async (token, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch requests ', error);
  }
};

export const getRequestByIdService = async (token, requestId) => {
  try {
    const response = await axios.get(`${API_URL}/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch request ', error);
  }
};

export const createRequestService = async (token, code, summary, description, employee_id) => {
  try {
    const response = await axios.post(`${API_URL}/requests`, {
      code,
      summary,
      description,
      employee_id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create request ', error);
  }
};

export const updateRequestService = async (token, requestId, code, summary, description) => {
  try {
    const response = await axios.put(`${API_URL}/requests/${requestId}`, {
      code,
      summary,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update request ', error);
  }
};

export const deleteRequestService = async (token, requestId) => {
  try {
    const response = await axios.delete(`${API_URL}/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete request ', error);
    throw new Error('Failed to delete request');
  }
}
