import React, {useState} from "react";
import axios from "axios";
import "../css/ChangePasswordComponent.css"
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";

const ChangePasswordComponent = ({token}) => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setPasswordData({...passwordData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp.");
            return;
        }

        const token = localStorage.getItem("token");

        // Thiết lập header auth
        const authHeader = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios
            .post(
                "http://localhost:8080/api/user/change-password",
                {
                    authHeader,
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            )
            .then(() => {
                // setMessage("Đổi mật khẩu thành công!");
                toast.success("🎉 Đổi mật khẩu thành công!", {
                    position: "top-center",
                    autoClose: 1000,
                    onClose: () => navigate("/")
                });
                setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",

                });

            })
            .catch((err) => {
                console.error(err);
                setMessage("Đổi mật khẩu thất bại.");
            });
    };

    return (
        <>
            <HeaderComponent/>
            <div className="change-password-container">
                <div className="change-password-box">
                    <h3>Đổi mật khẩu</h3>
                    <form onSubmit={handleSubmit}>
                        <label>Mật khẩu cũ</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Xác nhận đổi mật khẩu</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
            <FooterComponent/>
        </>

    );
};

export default ChangePasswordComponent;
