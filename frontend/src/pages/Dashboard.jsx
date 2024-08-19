import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <span>Welcome, {user?.username} </span>
            <button onClick={handleLogout} className="ml-4 py-2 px-4 bg-red-500 rounded hover:bg-red-600">Logout</button>
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
