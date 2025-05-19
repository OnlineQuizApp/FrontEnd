import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ProfileComponent.css"

const ProfileComponent = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Thiết lập header auth
    const authHeader = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/user/me", authHeader)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error(err);
                setMessage("Không thể lấy thông tin người dùng.");
            });
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        axios
            .put("http://localhost:8080/api/user/update", user, authHeader)
            .then((res) => {
                setMessage("Cập nhật thành công!");
            })
            .catch((err) => {
                console.error(err);
                setMessage("Cập nhật thất bại.");
            });
    };

    if (!user) return <p>Đang tải...</p>;

    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2>Thông tin cá nhân</h2>
                <form onSubmit={handleUpdate}>
                    <input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Họ tên"
                    />
                    <br />
                    <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <br />
                    <button type="submit">Cập nhật</button>
                </form>
                <button type="button" onClick={() => navigate("/change-Password")}>
                    Đổi mật khẩu
                </button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ProfileComponent;
