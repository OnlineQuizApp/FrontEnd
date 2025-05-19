// ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";
import "../css/ForgotComponent.css";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function ForgotPasswordComponent() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/user/forgot-password", { email });
            toast.success("🎉 Bạn vào hòm thư check email để cập nhật lại mật khẩu!", {
                position: "top-center",
                autoClose: 2000,
                onClose: () => navigate("/login")
            });
        } catch (err) {
            setMessage("Email not found or error occurred.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <form onSubmit={handleSubmit}>
                    <h2>Quên Mật khẩu</h2>
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Gửi link</button>
                    <p>{message}</p>
                </form>
            </div>
        </div>
    );
}
