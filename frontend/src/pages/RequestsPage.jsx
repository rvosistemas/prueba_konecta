import { useEffect, useState, useContext } from 'react';
import { getRequestsService } from '../services/requestService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token, user } = useContext(AuthContext);
  const limit = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequestsService(token, currentPage, limit);
        setRequests(data.requests);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / limit));
      } catch (error) {
        console.error('Failed to fetch requests', error);
      }
    };

    fetchRequests();
  }, [token, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <p className="mt-4">Total Requests: {totalCount}</p>
    </div>
  );
};

export default RequestsPage;
