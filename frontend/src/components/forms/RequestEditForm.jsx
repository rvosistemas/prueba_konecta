// RequestEditForm.jsx
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { getRequestByIdService, updateRequestService } from '../../services/requestService';
import { AuthContext } from '../../contexts/AuthContext';

const RequestEditForm = ({ requestId, onSuccess, onClose }) => {
  const [code, setCode] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const data = await getRequestByIdService(token, requestId);
        setCode(data.code);
        setSummary(data.summary);
        setDescription(data.description);
      } catch (error) {
        console.error('Failed to load request data ', error);
        setError('Failed to load request data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await updateRequestService(token, requestId, code, summary, description);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update request ', error);
      setError('Failed to update request.');
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

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Updating...' : 'Update Request'}
      </button>
    </form>
  );
};

RequestEditForm.propTypes = {
  requestId: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RequestEditForm;
