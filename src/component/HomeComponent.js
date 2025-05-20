import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/HomePage.css";

const HomePage = () => {
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
            } catch (error) {
                console.error("Invalid token:", error);
                handleLogout();
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <div className="homepage">
            {/* Header */}
            <header className="header">
                <div className="logo">QuizMaster</div>
                <nav className="nav">
                    <a href="/">Trang chủ</a>
                    <a href="/quiz">Quiz</a>
                    <a href="/history">Lịch sử</a>
                    <a href="/ranking">Thành tích</a>
                    {isAdmin && (
                        <a href="/admin">Trang admin</a>
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

            {/* Nội dung chính */}
            <main className="content">
                {/* Nội dung sẽ được thêm ở đây */}
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2025 QuizMaster. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
