import React, {useEffect, useState} from "react";
import axios from "axios";
import "../css/ChangePasswordComponent.css"
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
const apiUrl = process.env.REACT_APP_API_URL;
const ChangePasswordComponent = ({token}) => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect to login page if no token
        }
    }, [navigate]);
    const handleChange = (e) => {
        setPasswordData({...passwordData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp.");
            return;
        }
        if (passwordData.oldPassword === passwordData.newPassword) {
            setMessage("Mật khẩu mới không được giống mật khẩu cũ.");
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
                `${apiUrl}/api/user/change-password`,
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
                        <label>Mật khẩu cũ<span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>Mật khẩu mới<span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <label>Nhập lại mật khẩu<span className="text-danger">*</span></label>
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
