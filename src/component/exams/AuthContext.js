import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext(null); // Giá trị mặc định để tránh undefined

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    username: decoded.sub, // Giả sử 'sub' chứa username
                    roles: decoded.roles || []
                });
            } catch (err) {
                console.error('Lỗi giải mã token:', err);
                localStorage.removeItem('token');
                setUser(null);
                navigate('/login');
            }
        }
    }, [navigate]);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode(token);
            setUser({
                username: decoded.sub,
                roles: decoded.roles || []
            });
            navigate('/history');
        } catch (err) {
            console.error('Lỗi giải mã token:', err);
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};