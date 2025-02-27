import React from 'react';
import { Navigate } from 'react-router-dom';

// Helper to verify token validity and authorization
const isAuthenticated = (requiredType) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode token payload
    return payload && payload.type_user === requiredType;
};

// Protected Route Component
const PrivateRoute = ({ children, requiredType }) => {
    return isAuthenticated(requiredType) ? children : <Navigate to="/" />;
};

export default PrivateRoute;
