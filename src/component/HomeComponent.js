import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/HomePage.css";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import ExamSetList from "./examSet/ExamSetList";

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
            <Header/>
            <ExamSetList/>
            <Footer/>
        </div>
    );
};

export default HomePage;
