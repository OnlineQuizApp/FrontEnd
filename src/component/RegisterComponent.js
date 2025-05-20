import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/RegisterComponent.css";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

const RegisterComponent = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        passwordConfirm: "",
        name: "",
        email: ""
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
        setErrors({...errors, [e.target.name]: ""});
        setError("");
    };

    const validateForm = () => {
        const newErrors = {};
        // Kiểm tra theo thứ tự để đảm bảo lỗi đầu tiên được ưu tiên
        if (!form.username.trim()) {
            newErrors.username = "Tên đăng nhập không được bỏ trống";
        } else if (!/^[a-zA-Z0-9]{5,20}$/.test(form.username)) {
            newErrors.username = "Tên đăng nhập phải từ 5-20 ký tự, chỉ gồm chữ và số";
        }
        if (!form.password.trim()) {
            newErrors.password = "Mật khẩu không được bỏ trống";
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(form.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!";
        }
        if (form.password !== form.passwordConfirm) {
            newErrors.passwordConfirm = "Mật khẩu và xác nhận mật khẩu không khớp";
        }
        if (!form.name.trim()) {
            newErrors.name = "Họ và tên không được bỏ trống";
        } else if (!/^(?:[A-ZÀ-Ỹ][a-zà-ỹ]*\s)*[A-ZÀ-Ỹ][a-zà-ỹ]{0,28}$/.test(form.name)) {
            newErrors.name = "Họ tên phải viết hoa chữ cái đầu, chỉ gồm chữ cái và không quá 30 ký tự!";
        }
        if (!form.email.trim()) {
            newErrors.email = "Email không được bỏ trống";
        } else if (!/^[A-Za-z0-9_]+@[A-Za-z0-9.]+$/.test(form.email)) {
            newErrors.email = "Email không đúng định dạng";
        }
        return newErrors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setError("");

        // Xác thực phía client
        const clientErrors = validateForm();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            // Chỉ hiển thị lỗi đầu tiên dưới dạng toast
            const firstErrorField = Object.keys(clientErrors)[0];
            toast.error(clientErrors[firstErrorField], {position: "top-center", autoClose: 3000});
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
            toast.success("🎉 Đăng ký thành công!", {
                position: "top-center",
                autoClose: 1000
            });
            setTimeout(() => navigate("/login"), 1000); // Chờ toast hiển thị trước khi chuyển hướng
        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.status === 400 || err.response.status === 409) {
                    const backendErrors = {};
                    if (Array.isArray(err.response.data)) {
                        // Xử lý lỗi dạng mảng từ backend
                        err.response.data.forEach((error) => {
                            backendErrors[error.field] = error.message;
                        });
                        // Chỉ hiển thị lỗi đầu tiên dưới dạng toast
                        const firstError = err.response.data[0];
                        toast.error(firstError.message, {position: "top-center", autoClose: 3000});
                    } else if (typeof err.response.data === "string") {
                        // Xử lý lỗi dạng chuỗi (cho 409 hoặc các lỗi khác)
                        setError(err.response.data);
                        toast.error(err.response.data, {position: "top-center", autoClose: 3000});
                    } else {
                        // Xử lý lỗi dạng object (Map)
                        Object.keys(err.response.data).forEach((field) => {
                            backendErrors[field] = err.response.data[field];
                        });
                        // Chỉ hiển thị lỗi đầu tiên dưới dạng toast
                        const firstErrorField = Object.keys(err.response.data)[0];
                        toast.error(err.response.data[firstErrorField], {position: "top-center", autoClose: 3000});
                    }
                    setErrors(backendErrors);
                } else {
                    setError("Đã xảy ra lỗi không xác định");
                    toast.error("Đã xảy ra lỗi không xác định", {position: "top-center", autoClose: 3000});
                }
            } else {
                setError("Không thể kết nối đến server");
                toast.error("Không thể kết nối đến server", {position: "top-center", autoClose: 3000});
            }
        }
    };

    return (
        <>
            <HeaderComponent/>
            <div className="register-container">
                <div className="register-box">
                    <h2>Đăng ký tài khoản</h2>
                    <form onSubmit={handleRegister}>
                        <label htmlFor="username">Tên đăng nhập<span className="text-danger">*</span></label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p style={{color: "red"}}>{errors.username}</p>}
                        <label htmlFor="password">Mật khẩu<span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="password"

                            value={form.password}
                            onChange={handleChange}

                        />
                        {errors.password && <p style={{color: "red"}}>{errors.password}</p>}
                        <label htmlFor="passwordConfirm">Nhập lại mật khẩu<span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            onChange={handleChange}

                        />
                        {errors.passwordConfirm && <p style={{color: "red"}}>{errors.passwordConfirm}</p>}
                        <label htmlFor="name">Họ và tên<span className="text-danger">*</span></label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}

                        />
                        {errors.name && <p style={{color: "red"}}>{errors.name}</p>}
                        <label htmlFor="email">Email<span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}

                        />
                        {errors.email && <p style={{color: "red"}}>{errors.email}</p>}

                        <button type="submit">Đăng ký</button>
                        <p>
                            Đã có tài khoản?{" "}
                            <button type="button" onClick={() => navigate("/login")}>
                                Đăng nhập
                            </button>
                        </p>
                    </form>
                    {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>}
                </div>
                <ToastContainer/>
            </div>
            <FooterComponent/>
        </>
    );
};

export default RegisterComponent;