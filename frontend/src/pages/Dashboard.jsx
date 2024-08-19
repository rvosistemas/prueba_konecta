import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between">
          <div>
            <Link to="/employees" className="mr-4">Employees</Link>
            <Link to="/requests" className="mr-4">Requests</Link>
            {user?.role === 'admin' && (
              <Link to="/users" className="mr-4">Users</Link>
            )}
          </div>
          <div>
            <span>Welcome, {user?.username}</span>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
