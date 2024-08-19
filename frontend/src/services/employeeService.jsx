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

export const getEmployeeByIdService = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch employee ', error);
    throw new Error('Failed to fetch employee');
  }
}


export const createEmployeeService = async (token, name, hireDate, salary, userId) => {
  try {
    const response = await axios.post(`${API_URL}/employees`, {
      name,
      hire_date: hireDate,
      salary,
      user_id: userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create employee ', error);
    throw new Error('Failed to create employee');
  }
};

export const updateEmployeeService = async (token, employeeId, name, hireDate, salary, userId) => {
  try {
    const response = await axios.put(`${API_URL}/employees/${employeeId}`, {
      name,
      hire_date: hireDate,
      salary,
      user_id: userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update employee ', error);
    throw new Error('Failed to update employee');
  }
};

export const deleteEmployeeService = async (token, employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete employee ', error);
    throw new Error('Failed to delete employee');
  }
}
