import { useState } from "react";
import axios from "axios";
import "../css/ForgotComponent.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

export default function ForgotPasswordComponent() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post("http://localhost:8080/api/user/forgot-password", { email });
            toast.success("🎉 Bạn vào hòm thư check email để cập nhật lại mật khẩu!", {
                position: "top-center",
                autoClose: 2000,
                onClose: () => navigate("/login")
            });
        } catch (err) {
            setMessage("Email không tồn tại hoặc đã xảy ra lỗi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <HeaderComponent />
            <div className="forgot-password-container">
                <div className="forgot-password-box">
                    <form onSubmit={handleSubmit}>
                        <h2>Quên Mật khẩu</h2>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                "Gửi link"
                            )}
                        </button>
                        <p>{message}</p>
                    </form>
                </div>
            </div>
            <FooterComponent />
        </>
    );
}
