import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerService } from '../../services/authService';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username) {
      setError('Username is required.');
      return;
    }

    if (!name) {
      setError('Name is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!hireDate) {
      setError('Hire date is required.');
      return;
    }

    if (!salary) {
      setError('Salary is required.');
      return;
    }

    try {
      setLoading(true);
      await registerService(username, email, password, name, hireDate, salary);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl text-gray-800 font-semibold text-center mb-6">Register</h2>

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
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire Date:</label>
        <input
          type="date"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary:</label>
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
