import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <RegisterForm />
      <p className="mt-4 text-gray-700">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
