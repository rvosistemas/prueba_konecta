import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createEmployeeService } from '../services/employeeService';

const EmployeeForm = ({ onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [salary, setSalary] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await createEmployeeService(name, hireDate, salary);
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
