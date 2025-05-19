import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/LoginComponent.css";
import {toast} from "react-toastify";

const LoginComponent = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/account/login", form);
            localStorage.setItem("token", response.data.token);
            toast.success("🎉 Đăng nhập thành công!", {
                position: "top-center",
                autoClose: 1000,
                onClose: () => navigate("/")
            });
        } catch (err) {
            console.error(err);
            setError("Tài khoản hoặc mật khẩu không đúng");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <input
                        name="username"
                        placeholder="Tên đăng nhập"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Đăng nhập</button>
                    <button type="button" onClick={() => navigate("/resetPassword")}>
                        Quên mật khẩu
                    </button>
                    <p>
                        Chưa có tài khoản?
                        <button type="button" onClick={() => navigate("/register")}>
                            Đăng ký
                        </button>
                    </p>
                </form>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            </div>
        </div>
    );
};

export default LoginComponent;
