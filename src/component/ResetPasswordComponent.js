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
            setMessage("Mật khấu không khớp");
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
            setMessage("Link cập nhật mật khẩu đã hết hạn!");
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
                    <button type="submit">Cập nhật mật khẩu</button>
                    {message && <p>{message}</p>}
                </form>
            </div>
            <FooterComponent/>
        </>


    );
}
