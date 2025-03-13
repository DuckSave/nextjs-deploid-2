"use client"
import React, { useEffect, useState } from "react";

export default function ChatApp() {
const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new WebSocket("wss://localhost:8080/ws/chat");

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    // Lắng nghe tin nhắn mới và cập nhật state
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("New message received: ", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    // Cleanup khi component unmount
    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const socket = new WebSocket("wss://localhost:8080/ws/chat");

    socket.onopen = () => {
      // Gửi tin nhắn
      socket.send(JSON.stringify({ senderId: "67cabe6547d75855dda56974", receiverId: "67cabe7847d75855dda56975", content: message }));
      setMessage(""); // Reset input field after sending
    };
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.content || JSON.stringify(msg)}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
