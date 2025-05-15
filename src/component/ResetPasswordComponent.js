// ResetPassword.jsx
import { useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

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

            setMessage("Password reset successful.");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setMessage("Invalid or expired token.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
            />
            <button type="submit">Reset Password</button>
            <p>{message}</p>
        </form>
    );
}
