import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getUserByIdService, updateUserService } from '../../services/userService';

const UserEditForm = ({ userId, token, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserByIdService(token, userId);
        if (!data || data === null || data === undefined) {
          throw new Error('User not found.');
        }
        setUsername(data.user.username);
        setEmail(data.user.email);
        setPassword(data.user.password);
        setRole(data.user.role);
      } catch (error) {
        console.error('Failed to load user data ', error);
        setError('Failed to load user data. ');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await updateUserService(token, userId, username, email, password, role);
      onSuccess();
    } catch (error) {
      console.error('Failed to update user ', error);
      setError('Failed to update user. ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Updating...' : 'Update User'}
      </button>
    </form>
  );
};

UserEditForm.propTypes = {
  userId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default UserEditForm;
