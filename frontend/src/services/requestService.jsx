import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getRequestsService = async (token, page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit },
  });
  return response.data;
};

export const getRequestByIdService = async (token, requestId) => {
  const response = await axios.get(`${API_URL}/requests/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createRequestService = async (token, code, summary, description) => {
  const response = await axios.post(`${API_URL}/requests`, {
    code,
    summary,
    description,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateRequestService = async (token, requestId, code, summary, description) => {
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
};
