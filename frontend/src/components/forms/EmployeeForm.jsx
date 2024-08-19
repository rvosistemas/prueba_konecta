import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { createEmployeeService } from '../../services/employeeService';
import { getAvailableUsersService } from '../../services/userService';
import { AuthContext } from '../../contexts/AuthContext';
import { formatDateToDDMMYYYY } from '../../utils/format';

const EmployeeForm = ({ onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [salary, setSalary] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        const data = await getAvailableUsersService(token);
        if (data === null || data === undefined) {
          throw new Error('Failed to load available users');
        }
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to load available users ', error);
        setError('Failed to load available users');
      }
    };

    fetchAvailableUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const formattedHireDate = formatDateToDDMMYYYY(hireDate);
      await createEmployeeService(token, name, formattedHireDate, salary, userId);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">
          Hire Date:
        </label>
        <input
          type="date"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
          Salary:
        </label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="user" className="block text-sm font-medium text-gray-700">
          User:
        </label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="" disabled>Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  );
};

EmployeeForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmployeeForm;
