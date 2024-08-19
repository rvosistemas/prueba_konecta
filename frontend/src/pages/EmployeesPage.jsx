import { useEffect, useState, useContext } from 'react';
import { getEmployeesService } from '../services/employeeService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { formatSalary, formatDate, formatStatus } from '../utils/format';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token, user } = useContext(AuthContext);
  const limit = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployeesService(token, currentPage, limit);
        setEmployees(data.employees);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / limit));
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };

    fetchEmployees();
  }, [token, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (employee) => {
    console.log('Edit', employee);
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
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add Employee
        </button>
      )}
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
    </div>
  );
};

export default EmployeesPage;
