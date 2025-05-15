// ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordComponent() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/user/forgot-password", { email });
            setMessage("Check your email for reset link.");
        } catch (err) {
            setMessage("Email not found or error occurred.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Send Reset Link</button>
            <p>{message}</p>
        </form>
    );
}
