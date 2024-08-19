import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
      <p className="mt-4 text-gray-700">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
