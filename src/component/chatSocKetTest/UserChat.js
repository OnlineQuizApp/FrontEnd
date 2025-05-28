import React, { useState } from "react";
import useChatWebSocket from "../chatSocKetTest/userChatWebSocket";

function UserChat({ username }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const { sendMessageToAdmin } = useChatWebSocket(username, (message) => {
        setMessages((prev) => [...prev, message]);
    });

    const send = () => {
        if (!input.trim()) return;
        sendMessageToAdmin(input);
        setMessages((prev) => [
            ...prev,
            { content: input, sender: username, timestamp: new Date().toISOString() },
        ]);
        setInput("");
        console.log("user chat: "+username)
    };

    return (
        <div>
            <h3>Chat với Admin</h3>
            <div
                style={{
                    border: "1px solid #ccc",
                    height: 300,
                    overflowY: "auto",
                    padding: 10,
                    marginBottom: 10,
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            textAlign: msg.sender === username ? "right" : "left",
                            margin: "5px 0",
                        }}
                    >
                        <b>{msg.sender}:</b> {msg.content}
                        <br />
                        <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
            />
            <button onClick={send}>Gửi</button>
        </div>
    );
}

export default UserChat;
