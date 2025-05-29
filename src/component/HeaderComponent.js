import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../css/HeaderComponent.css';

const Header = () => {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.sub);
                const roles = decoded.roles || [];
                if (roles.includes("ROLE_ADMIN")) {
                    setIsAdmin(true);
                }
            } catch {
                handleLogout();
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="logo">QuizMaster</div>
            <nav className="nav">
                <a href="/" style={{textDecoration:'none'}}>Trang chủ</a>
                {!isAdmin && (
                    <a href="/quiz" style={{textDecoration:'none'}}>Quiz</a>
                )}
                {!isAdmin && (
                    <a href="/history" style={{textDecoration:'none'}}>Lịch sử</a>
                )}
                <a href="/leaderboard" style={{textDecoration:'none'}}>Thành tích</a>
                {isAdmin && (
                    <a href="/admin">Trang admin</a>
                )}
                {isAdmin && (
                    <a href="/statistics">Thống kê</a>
                )}
                {isAdmin && (
                    <a href="/users">Quản lý người dùng</a>
                )}
            </nav>
            <div className="user-section">
                {username ? (
                    <div className="dropdown">
                        <span className="username">Xin chào, {username}</span>
                        <div className="dropdown-content">
                            <button onClick={() => navigate("/profile")}>Hồ sơ người dùng</button>
                            <button onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    </div>
                ) : (
                    <button className="login-btn" onClick={() => navigate("/login")}>Đăng nhập</button>
                )}
            </div>
        </header>
    );
};

export default Header;
