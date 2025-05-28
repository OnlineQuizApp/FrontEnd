import { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const SOCKET_URL = "http://localhost:8080/chat"; // endpoint websocket backend

export default function useChatWebSocket(username, onMessageReceived) {
    const client = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        client.current = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            debug: (str) => console.log("[STOMP DEBUG]", str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        client.current.onConnect = () => {
            console.log("Connected to WebSocket");

            // Subscribe kênh nhận tin nhắn riêng của user
            client.current.subscribe(`/user/queue/message`, (message) => {
                if (message.body) {
                    const msg = JSON.parse(message.body);
                    onMessageReceived(msg);
                }
            });
        };

        client.current.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Details: " + frame.body);
        };

        client.current.activate();

        return () => {
            if (client.current) client.current.deactivate();
        };
    }, [onMessageReceived]);

    // Hàm gửi tin nhắn (ví dụ gửi user -> admin)
    const sendMessageToAdmin = (content) => {
        if (client.current && client.current.connected) {
            const message = {
                content,
                sender: username,
                timestamp: new Date().toISOString(),
            };
            client.current.publish({
                destination: "/app/chat.sendToAdmin",
                body: JSON.stringify(message),
            });
        }
    };

    // Hàm admin gửi trả lời (ví dụ dùng khi admin UI)
    const replyToUser = (recipient, content) => {
        if (client.current && client.current.connected) {
            const message = {
                content,
                recipient,
                sender: "admin",
                timestamp: new Date().toISOString(),
            };
            client.current.publish({
                destination: "/app/chat.replyToUser",
                body: JSON.stringify(message),
            });
        }
    };

    return {
        sendMessageToAdmin,
        replyToUser,
    };
}
