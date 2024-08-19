import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { createRequestService } from '../../services/requestService';
import { getEmployeesService } from '../../services/employeeService';
import { AuthContext } from '../../contexts/AuthContext';

const RequestForm = ({ onSuccess, onClose }) => {
  const [code, setCode] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployeesService(token);
        if (employeesData === null || employeesData === undefined) {
          throw new Error('Failed to load employees');
        }
        setEmployees(employeesData.employees);
      } catch (error) {
        console.error('Failed to load employees ', error);
        setError('Failed to load employees.');
      }
    };

    fetchEmployees();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await createRequestService(token, code, summary, description, employeeId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create request ', error);
      setError('Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Code:
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          Summary:
        </label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
          Employee:
        </label>
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="" disabled>Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Creating...' : 'Create Request'}
      </button>
    </form>
  );
};

RequestForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RequestForm;
