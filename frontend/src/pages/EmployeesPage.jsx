import React, { useEffect, useState, useContext } from 'react';
import { getEmployeesService } from '../services/employeeService';
import { AuthContext } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import { formatSalary, formatDate, formatStatus } from '../utils/format';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployeesService(token);
        setEmployees(data.employees);
        setTotalCount(data.count);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };

    fetchEmployees();
  }, [token]);

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
    { label: 'is Active', field: 'is_active', formatter: formatStatus },
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
      <p className="mt-4">Total Employees: {totalCount}</p>
    </div>
  );
};

export default EmployeesPage;
