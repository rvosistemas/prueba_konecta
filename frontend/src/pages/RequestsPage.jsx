import React, { useEffect, useState, useContext } from 'react';
import { getRequestsService } from '../services/requestService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequestsService(token);
        setRequests(data.requests);
        setTotalCount(data.count);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      }
    };

    fetchRequests();
  }, [token]);

  const handleEdit = (request) => {
    console.log('Edit', request);
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
  };

  const columns = [
    { label: 'Code', field: 'code' },
    { label: 'Summary', field: 'summary' },
    { label: 'Description', field: 'description' },
    { label: 'Employee ID', field: 'employee_id' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Requests</h1>
      {user?.role === 'admin' && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Request
        </button>
      )}
      <DataTable
        columns={columns}
        data={requests}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={user?.role === 'admin'}
      />
      <p className="mt-4">Total Requests: {totalCount}</p>
    </div>
  );
};

export default RequestsPage;
