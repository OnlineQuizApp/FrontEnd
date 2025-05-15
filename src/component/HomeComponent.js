import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            const decoded = jwtDecode(token);
            console.log("Toàn bộ nội dung token:", decoded);
            console.log("Các trường có trong token:", Object.keys(decoded));
            setUsername(decoded.sub);
        } catch (error) {
            console.error("Invalid token:", error);
            handleLogout();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <button onClick={() => navigate("/profile")}>Hồ sơ cá nhân</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;