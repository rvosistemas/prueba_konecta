import { useEffect, useState, useContext, useCallback } from 'react';
import { getEmployeesService } from '../services/employeeService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { formatSalary, formatDate, formatStatus } from '../utils/format';
import ModalWrapper from '../components/ModalWrapper';
import EmployeeForm from '../components/forms/EmployeeForm';
import EmployeeEditForm from '../components/forms/EmployeeEditForm';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);
  const limit = 10;

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEmployeesService(token, currentPage, limit);
      setEmployees(data.employees);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / limit));
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEmployeeCreatedOrUpdated = () => {
    fetchEmployees();
    handleCloseModal();
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    handleOpenModal();
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    handleOpenModal();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
  };

  const columns = [
    { label: 'Name', field: 'name' },
    { label: 'Salary', field: 'salary', formatter: formatSalary },
    { label: 'Hire Date', field: 'hire_date', formatter: formatDate },
    { label: 'Status', field: 'isActive', formatter: formatStatus },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Employees</h1>
      {user?.role === 'admin' && (
        <button onClick={handleAddEmployee} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Employee
        </button>
      )}
      <ModalWrapper isOpen={isModalOpen} onRequestClose={handleCloseModal} title={editingEmployee ? "Edit Employee" : "Create Employee"}>
        {editingEmployee ? (
          <EmployeeEditForm employeeId={editingEmployee} onSuccess={handleEmployeeCreatedOrUpdated} onClose={handleCloseModal} />
        ) : (
          <EmployeeForm onSuccess={handleEmployeeCreatedOrUpdated} onClose={handleCloseModal} />
        )}
      </ModalWrapper>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions={user?.role === 'admin'}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <p className="mt-4">Total Employees: {totalCount}</p>
        </>
      )}
    </div>
  );
};

export default EmployeesPage;
