    import React, { useState } from "react";
    import useChatWebSocket from "../chatSocKetTest/userChatWebSocket";

    function AdminChat({ adminUsername }) {
        const [messages, setMessages] = useState([]);
        const [input, setInput] = useState("");
        const [recipient, setRecipient] = useState(""); // username user muốn trả lời

        const { replyToUser } = useChatWebSocket(adminUsername, (message) => {
            setMessages((prev) => [...prev, message]);
        });

        const sendReply = () => {
            if (!input.trim() || !recipient.trim()) return;
            replyToUser(recipient, input);
            setMessages((prev) => [...prev, { content: input, sender: adminUsername, recipient, timestamp: new Date().toISOString() }]);
            setInput("");
        };

        return (
            <div>
                <h3>Admin Chat</h3>
                <input
                    placeholder="Tên người dùng muốn trả lời"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto", padding: 10, marginBottom: 10 }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ textAlign: msg.sender === adminUsername ? "right" : "left", margin: "5px 0" }}>
                            <b>{msg.sender}:</b> {msg.content} <br />
                            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Nhập tin nhắn trả lời"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendReply}>Gửi trả lời</button>
            </div>
        );
    }

    export default AdminChat;
