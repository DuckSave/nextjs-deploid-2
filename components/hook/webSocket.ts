import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { jwtDecode } from "jwt-decode";

interface Message {
  id?: number;
  senderName: string;
  receiverName: string; // 🛠 Đổi từ receiverId → receiverName
  message: string;
  timestamp: string;
}

export default function useWebSocketChat(userId: string | null, selectedUserName: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const clientRef = useRef<Client | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // Lưu role từ token

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      setUserRole(decoded.role); // Lưu role vào state
      console.log("🔑 Role:", decoded.role);
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
    }
  }, []);

  useEffect(() => {
    if (!userId || !userRole) return; // Nếu chưa có role thì đợi

    const socket = new SockJS("https://3.107.182.209:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket Connected!");

        // 🔥 Nếu là ADMIN, lắng nghe danh sách user online
        if (userRole === "ROLE_ADMIN") {
          console.log("📡 Admin đang subscribe danh sách user online...");
          stompClient.subscribe("/topic/users-online", (message) => {
            const users: string[] = JSON.parse(message.body);
            setOnlineUsers(users);
            console.log("📡 Online Users:", users);
          });
        }

        // Lắng nghe tin nhắn riêng tư
        stompClient.subscribe(`/user/${userId}/private`, (message) => {
          const receivedMessage: Message = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        // Gửi thông báo user đã online
        stompClient.publish({
          destination: "/app/join",
          body: JSON.stringify({ senderName: userId, status: "JOIN" }),
        });

        console.log(`📡 Subscribed: /user/${userId}/private`);
      },
      onStompError: (frame) => {
        console.error("❌ WebSocket Error:", frame);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      if (stompClient.connected) {
        stompClient.publish({
          destination: "/app/leave",
          body: JSON.stringify({ senderName: userId, status: "LEAVE" }),
        });
      }
      stompClient.deactivate();
    };
  }, [userId, userRole]);

  const sendMessage = (content: string) => {
    if (!userId || !selectedUserName || !clientRef.current?.connected) return;

    const newMessage: Message = {
      senderName : userId,
      receiverName: selectedUserName, // 🛠 Đổi sang receiverName
      message: content,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Gửi tin nhắn:", newMessage); // Debug log

    clientRef.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify(newMessage),
    });

    setMessages((prev) => [...prev, { ...newMessage, id: prev.length + 1 }]);
  };

  return { messages, sendMessage, onlineUsers };
}
