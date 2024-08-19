import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AdminRoute = ({ element }) => {
  const { user } = useContext(AuthContext);

  return user && user.role === 'admin' ? element : <Navigate to="/" />;
};

AdminRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default AdminRoute;
