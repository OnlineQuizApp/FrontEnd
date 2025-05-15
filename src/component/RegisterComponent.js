import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
        name: "",
        email: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.password !== form.passwordConfirm) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/account/register", {
                ...form,
                role: "USER", // Nếu backend yêu cầu truyền rõ role
            });
            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Đăng ký thất bại! Tài khoản có thể đã tồn tại.");
        }
    };

    return (
        <div>
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={handleRegister}>
                <input
                    name="username"
                    placeholder="Tên đăng nhập"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Xác nhận mật khẩu"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    name="name"
                    placeholder="Họ và tên"
                    value={form.name}
                    onChange={handleChange}
                />
                <br />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <br />
                <button type="submit">Đăng ký</button>
                <p>
                    Đã có tài khoản?{" "}
                    <button type="button" onClick={() => navigate("/login")}>
                        Đăng nhập
                    </button>
                </p>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default RegisterComponent;
