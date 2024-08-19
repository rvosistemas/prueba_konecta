import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard';

const EmployeesPage = lazy(() => import('../pages/EmployeesPage'));
const RequestsPage = lazy(() => import('../pages/RequestsPage'));
const UserManagementPage = lazy(() => import('../pages/UserManagementPage'));
const WelcomePage = lazy(() => import('../pages/WelcomePage'));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />}>
            <Route index element={<WelcomePage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="users" element={<AdminRoute element={<UserManagementPage />} />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
