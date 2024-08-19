import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getRequestByIdService, updateRequestService } from '../../services/requestService';
import { getEmployeesService } from '../../services/employeeService';
import { AuthContext } from '../../contexts/AuthContext';

const RequestEditForm = ({ requestId, onSuccess }) => {
  const [request, setRequest] = useState({
    code: '',
    summary: '',
    description: '',
    employeeId: ''
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      try {
        const requestData = await getRequestByIdService(token, requestId);
        const employeesData = await getEmployeesService(token);
        if (!requestData || !employeesData) {
          throw new Error('Failed to load data');
        }
        setRequest({
          code: requestData.request.code,
          summary: requestData.request.summary,
          description: requestData.request.description,
          employeeId: requestData.request.employee_id
        });
        setEmployees(employeesData.employees);
      } catch (error) {
        setError(error.message);
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, [token, requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateRequestService(token, requestId, request.code, request.summary, request.description, request.employeeId);
      onSuccess();
    } catch (error) {
      setError('Failed to update request: ' + error.message);
      console.error('Update request error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="code">Code:</label>
        <input type="text" name="code" value={request.code} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
      </div>
      <div className="mb-4">
        <label htmlFor="summary">Summary:</label>
        <input type="text" name="summary" value={request.summary} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
      </div>
      <div className="mb-4">
        <label htmlFor="description">Description:</label>
        <textarea name="description" value={request.description} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md" />
      </div>
      <div className="mb-4">
        <label htmlFor="employeeId">Employee:</label>
        <select name="employeeId" value={request.employeeId} onChange={handleChange} required className="mt-1 p-2 w-full border rounded-md">
          <option value="">Select an employee</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>id: {employee.id} name: {employee.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 px-4 text-white rounded-md bg-blue-500 hover:bg-blue-600">
        Update Request
      </button>
    </form>
  );
};

RequestEditForm.propTypes = {
  requestId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default RequestEditForm;
