import React, { useEffect, useState, useContext } from 'react';
import { getUsersService } from '../services/userService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import { formatStatus } from '../utils/format';


const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersService(token);
        setUsers(data.users);
        setTotalCount(data.count);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleEdit = (user) => {
    console.log('Edit', user);
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
  };

  const columns = [
    { label: 'Username', field: 'username' },
    { label: 'Email', field: 'email' },
    { label: 'Role', field: 'role' },
    { label: 'isActive', field: 'isActive', formatter: formatStatus },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add User
      </button>
      <DataTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showActions={true}
      />
      <p className="mt-4">Total Users: {totalCount}</p>
    </div>
  );
};

export default UserManagementPage;
