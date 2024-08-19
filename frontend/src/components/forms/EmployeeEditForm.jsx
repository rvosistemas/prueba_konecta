import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getEmployeeByIdService, updateEmployeeService } from '../../services/employeeService';
import { getUsersService, getAvailableUsersService } from '../../services/userService';
import { AuthContext } from '../../contexts/AuthContext';
import { formatDateToYYYYMMDD, formatDate } from '../../utils/format';

const EmployeeEditForm = ({ employeeId, onSuccess }) => {
  const [employee, setEmployee] = useState({
    name: '',
    hireDate: '',
    salary: '',
    userId: ''
  });
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const data = await getEmployeeByIdService(token, employeeId);
        if (data === null || data === undefined) {
          throw new Error('Failed to load employee data');
        }
        setEmployee({
          name: data.employee.name,
          hireDate: formatDateToYYYYMMDD(data.employee.hire_date),
          salary: data.employee.salary,
          userId: data.employee.user_id
        });
      } catch (error) {
        setError('Failed to load employee data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const userData = await getUsersService(token);
        if (userData === null || userData === undefined) {
          throw new Error('Failed to load users');
        }
        setUsers(userData.users);
      } catch (error) {
        console.error('Failed to load users', error);
      }
    };

    const fetchAvailableUsers = async () => {
      try {
        const availableData = await getAvailableUsersService(token);
        if (availableData === null || availableData === undefined) {
          throw new Error('Failed to load available users');
        }
        setAvailableUsers(availableData.users);
      } catch (error) {
        console.error('Failed to load available users', error);
      }
    };

    fetchEmployeeData();
    fetchUsers();
    fetchAvailableUsers();
  }, [token, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formattedHireDate = formatDate(employee.hireDate);
      await updateEmployeeService(token, employeeId, employee.name, formattedHireDate, employee.salary, employee.userId);
      onSuccess();
    } catch (error) {
      setError('Failed to update employee');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
        <input type="text" name="name" value={employee.name} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
      </div>
      <div className="mb-4">
        <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire Date:</label>
        <input type="date" name="hireDate" value={employee.hireDate} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
      </div>
      <div className="mb-4">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary:</label>
        <input type="number" name="salary" value={employee.salary} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
      </div>
      <div className="mb-4">
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User:</label>
        <select name="userId" value={employee.userId} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md">
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id} disabled={!availableUsers.some(au => au.id === user.id) && user.id !== employee.userId}>
              {user.username} {availableUsers.some(au => au.id === user.id) ? "" : "(Assigned)"}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading} className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
        {loading ? 'Updating...' : 'Update Employee'}
      </button>
    </form>
  );
};

EmployeeEditForm.propTypes = {
  employeeId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default EmployeeEditForm;
