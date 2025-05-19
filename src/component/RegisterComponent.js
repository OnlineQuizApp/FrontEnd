import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/RegisterComponent.css";

const RegisterComponent = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
        name: "",
        email: ""
    });

    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Xoá lỗi khi người dùng chỉnh sửa
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.password !== form.passwordConfirm) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/account/register", {
                username: form.username,
                password: form.password,
                passwordConfirm: form.passwordConfirm,
                name: form.name,
                email: form.email,
                role: "USER"
            });

            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    // Lỗi validation
                    setErrors(err.response.data);
                } else if (err.response.status === 409) {
                    // Lỗi xung đột (username/email tồn tại)
                    setError(err.response.data);
                } else {
                    setError("Đã xảy ra lỗi không xác định");
                }
            } else {
                setError("Không thể kết nối đến server");
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Đăng ký tài khoản</h2>
                <form onSubmit={handleRegister}>
                    <input
                        name="username"
                        placeholder="Tên đăng nhập"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="Xác nhận mật khẩu"
                        value={form.passwordConfirm}
                        onChange={handleChange}
                        required
                    />
                    {errors.passwordConfirm && <p style={{ color: 'red' }}>{errors.passwordConfirm}</p>}

                    <input
                        name="name"
                        placeholder="Họ và tên"
                        value={form.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

                    <button type="submit">Đăng ký</button>
                    <p>
                        Đã có tài khoản?
                        <button type="button" onClick={() => navigate("/login")}>
                            Đăng nhập
                        </button>
                    </p>
                </form>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            </div>
        </div>
    );
};

export default RegisterComponent;
