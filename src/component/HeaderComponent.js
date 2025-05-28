import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../css/HeaderComponent.css';

const Header = () => {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.sub);
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
                <a href="/quiz" style={{textDecoration:'none'}}>Quiz</a>
                <a href="/history" style={{textDecoration:'none'}}>Lịch sử</a>
                <a href="/leaderboard" style={{textDecoration:'none'}}>Thành tích</a>
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
