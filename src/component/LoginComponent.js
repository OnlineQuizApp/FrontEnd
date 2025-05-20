import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/LoginComponent.css";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

const LoginComponent = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.username.trim()) {
            newErrors.username = "Tên đăng nhập không được bỏ trống!";
        } else if (!/^[a-zA-Z][a-zA-Z0-9]{0,19}$/.test(form.username)) {
            newErrors.username = "Tên đăng nhập phải bắt đầu bằng chữ, chỉ gồm chữ hoặc số và tối đa 20 ký tự!";
        }
        if (!form.password.trim()) {
            newErrors.password = "Mật khẩu không được bỏ trống!";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(form.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!";
        }
        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Ngăn chặn xử lý nếu đang gửi yêu cầu

        setErrors({});
        setIsSubmitting(true);

        // Xác thực phía client
        const clientErrors = validateForm();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            // Chỉ hiển thị lỗi đầu tiên trong toast, nếu không có toast nào đang hiển thị
            const firstErrorField = Object.keys(clientErrors)[0];
            if (!toast.isActive("error-toast")) {
                toast.error(clientErrors[firstErrorField], {
                    position: "top-center",
                    autoClose: 3000,
                    toastId: "error-toast"
                });
            }
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/account/login", form);
            localStorage.setItem("token", response.data.token);
            toast.success(" Đăng nhập thành công!", {
                position: "top-center",
                autoClose: 2000,
                toastId: "success-toast"
            });
            setTimeout(() => {
                navigate("/");
            }, 1000); // đợi 1 giây để toast hiển thị xong rồi mới chuyển trang
        } catch (err) {
            if (err.response && err.response.data) {
                const backendData = err.response.data;
                const backendErrors = {};

                if (Array.isArray(backendData)) {
                    // Xử lý lỗi dạng mảng từ backend
                    backendData.forEach((error) => {
                        backendErrors[error.field] = error.message;
                    });
                    // Chỉ hiển thị lỗi đầu tiên trong toast, nếu không có toast nào đang hiển thị
                    const firstError = backendData[0];
                    if (!toast.isActive("error-toast")) {
                        toast.error(firstError.message, {
                            position: "top-center",
                            autoClose: 3000,
                            toastId: "error-toast"
                        });
                    }
                    setErrors(backendErrors);
                } else if (typeof backendData === "string") {
                    // Xử lý lỗi dạng chuỗi
                    if (!toast.isActive("error-toast")) {
                        toast.error(backendData, {
                            position: "top-center",
                            autoClose: 3000,
                            toastId: "error-toast"
                        });
                    }
                } else {
                    // Xử lý lỗi dạng object
                    Object.keys(backendData).forEach((field) => {
                        backendErrors[field] = backendData[field];
                    });
                    const firstErrorField = Object.keys(backendData)[0];
                    if (!toast.isActive("error-toast")) {
                        toast.error(backendData[firstErrorField], {
                            position: "top-center",
                            autoClose: 3000,
                            toastId: "error-toast"
                        });
                    }
                    setErrors(backendErrors);
                }
            } else {
                if (!toast.isActive("error-toast")) {
                    toast.error("Đã có lỗi xảy ra, vui lòng thử lại!", {
                        position: "top-center",
                        autoClose: 3000,
                        toastId: "error-toast"
                    });
                }
            }
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <HeaderComponent />
            <div className="login-container">
                <div className="login-box">
                    <h2>Đăng nhập</h2>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                        {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
                        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                        <button type="button" onClick={() => navigate("/resetPassword")}>
                            Quên mật khẩu
                        </button>
                        <p>
                            Chưa có tài khoản?{" "}
                            <button type="button" onClick={() => navigate("/register")}>
                                Đăng ký
                            </button>
                        </p>
                    </form>
                </div>
            </div>
            <FooterComponent />
            <ToastContainer />
        </>
    );
};

export default LoginComponent;