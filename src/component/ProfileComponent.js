import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ProfileComponent.css"
import {toast} from "react-toastify";
import FooterComponent from "./FooterComponent";
import HeaderComponent from "./HeaderComponent";
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
                toast.success("🎉 Cập nhật thành công!", {
                    position: "top-center",
                    autoClose: 1000,
                    onClose: () => navigate("/")
                });
            })
            .catch((err) => {
                console.error(err);
                setMessage("Cập nhật thất bại.");
            });
    };

    if (!user) return <p>Đang tải...</p>;

    return (
        <>
            <HeaderComponent/>
            <div className="profile-container">
                <div className="profile-box">
                    <h2>Thông tin cá nhân</h2>
                    <form onSubmit={handleUpdate}>
                        <label>Họ và tên</label>
                        <input
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                        />
                        <br />
                        <label>Email</label>
                        <input
                            name="email"
                            value={user.email}
                            onChange={handleChange}
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
            <FooterComponent/>
        </>
    );
};

export default ProfileComponent;
