import { useEffect, useState, useContext, useCallback } from 'react';
import { getRequestsService } from '../services/requestService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ModalWrapper from '../components/ModalWrapper';
import RequestForm from '../components/forms/RequestForm';
import RequestEditForm from '../components/forms/RequestEditForm';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const limit = 10;

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRequestsService(token, currentPage, limit);
      setRequests(data.requests);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRequest(null);
  };

  const handleRequestCreatedOrUpdated = () => {
    fetchRequests();
    handleCloseModal();
  };

  const handleEdit = (request) => {
    setEditingRequest(request.id);
    handleOpenModal();
  };

  const handleAddRequest = () => {
    setEditingRequest(null);
    handleOpenModal();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <button onClick={handleAddRequest} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Request
        </button>
      )}
      <ModalWrapper isOpen={isModalOpen} onRequestClose={handleCloseModal} title={editingRequest ? "Edit Request" : "Create Request"}>
        {editingRequest ? (
          <RequestEditForm requestId={editingRequest} onSuccess={handleRequestCreatedOrUpdated} onClose={handleCloseModal} />
        ) : (
          <RequestForm onSuccess={handleRequestCreatedOrUpdated} onClose={handleCloseModal} />
        )}
      </ModalWrapper>
      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default RequestsPage;
