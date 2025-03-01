// ProtectedRoute.js
import React, { useEffect } from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import LoginPage from './LoginPage';

const ProtectedRoute = ({ element: Element, ...props }) => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    navigate("/login");
  }, []);

  return <>{<Element {...props} />} </>;
};

export default ProtectedRoute;
