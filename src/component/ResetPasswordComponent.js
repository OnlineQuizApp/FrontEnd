// ResetPassword.jsx
import { useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import "../css/ResetPasswordComponent.css";
import {toast} from "react-toastify";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

export default function ResetPasswordComponent() {
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirm) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/user/reset-password", {
                token,
                newPassword,
            });

            toast.success("🎉 Cập nhật thành công!", {
                position: "top-center",
                autoClose: 1000,
                onClose: () => navigate("/")
            });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setMessage("Invalid or expired token.");
        }
    };

    return (

        <>
        <HeaderComponent/>
            <div className="reset-password-container">
                <form onSubmit={handleSubmit} className="reset-password-box">
                    <h2>Đặt lại mật khẩu</h2>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
            <FooterComponent/>
        </>


    );
}
