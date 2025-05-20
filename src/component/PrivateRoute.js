import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, roles = [] }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRoles = decoded.roles || [];

        // Nếu không yêu cầu role cụ thể => chỉ cần có token là được
        if (roles.length === 0) return children;

        // Nếu yêu cầu role cụ thể (ví dụ roles = ['ADMIN'])
        const hasRequiredRole = roles.some(role => userRoles.includes(`ROLE_${role}`));
        return hasRequiredRole ? children : <Navigate to="/unauthorized" />;
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
