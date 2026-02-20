import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
    // This can be expanded to check token validity
    return localStorage.getItem('token') !== null;
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child routes.
    // The <Outlet /> will render the nested route's component.
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
