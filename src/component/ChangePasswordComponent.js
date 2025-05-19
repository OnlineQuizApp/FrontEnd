import React, { useState } from "react";
import axios from "axios";
import "../css/ChangePasswordComponent.css"
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangePasswordComponent = ({ token }) => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp.");
            return;
        }

        const token = localStorage.getItem("token");

        // Thiết lập header auth
        const authHeader = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios
            .post(
                "http://localhost:8080/api/user/change-password",
                {
                    authHeader,
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(() => {
                // setMessage("Đổi mật khẩu thành công!");
                toast.success("🎉 Đổi mật khẩu thành công!", {
                    position: "top-center",
                    autoClose: 1000,
                    onClose: () => navigate("/")
                });
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",

                });

            })
            .catch((err) => {
                console.error(err);
                setMessage("Đổi mật khẩu thất bại.");
            });
    };

    return (
        <div className="change-password-container">
            <div className="change-password-box">
                <h3>Đổi mật khẩu</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Mật khẩu cũ"
                        value={passwordData.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Mật khẩu mới"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Xác nhận đổi mật khẩu</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default ChangePasswordComponent;
