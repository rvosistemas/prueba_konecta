import { useEffect, useState, useContext, useCallback } from 'react';
import { getUsersService } from '../services/userService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { formatStatus } from '../utils/format';
import ModalWrapper from '../components/ModalWrapper';
import UserForm from '../components/forms/UserForm';
import UserEditForm from '../components/forms/UserEditForm';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsersService(token, currentPage, limit);
      setUsers(data.users);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUserCreated = () => {
    fetchUsers();
    handleCloseModal();
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    handleOpenModal();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
  };

  const columns = [
    { label: 'Username', field: 'username' },
    { label: 'Email', field: 'email' },
    { label: 'Role', field: 'role' },
    { label: 'Status', field: 'isActive', formatter: formatStatus },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <button onClick={() => setEditingUser(null)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add User
      </button>
      <ModalWrapper isOpen={isModalOpen} onRequestClose={handleCloseModal} title={editingUser ? "Edit User" : "Create User"}>
        {editingUser ? (
          <>
            {console.log('Editing User ID:', editingUser)}
            <UserEditForm userId={editingUser} token={token} onSuccess={handleUserCreated} onClose={handleCloseModal} />
          </>
        ) : (
          <UserForm onSuccess={handleUserCreated} onClose={handleCloseModal} />
        )}
      </ModalWrapper>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={true}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="mt-4">Total Users: {totalCount}</p>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
