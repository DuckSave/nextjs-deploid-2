"use client";
import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatRoom = () => {
    interface ChatMessage {
        senderName: string;
        message: string;
        receiverName?: string;
        type: "CHAT" | "PRIVATE";
    }

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState("");
    const [privateMessage, setPrivateMessage] = useState("");
    const [receiver, setReceiver] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [username, setUsername] = useState("");
    const [joined, setJoined] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
      if (joined && username) {
          const socket = new SockJS("https://3.107.182.209:8080/ws"); // Sửa URL nếu cần
          const client = new Client({
              webSocketFactory: () => socket,
              onConnect: () => {
                  console.log(`✅ Đã kết nối WebSocket!`);
  
                  client.subscribe(`/chatroom/public`, (msg) => {
                      setMessages((prev) => [...prev, JSON.parse(msg.body)]);
                  });
  
                  client.subscribe(`/user/${username}/private`, (msg) => {
                      setPrivateMessages((prev) => [...prev, JSON.parse(msg.body)]);
                  });
  
                  client.subscribe(`/topic/online-users`, (msg) => {
                      setOnlineUsers(JSON.parse(msg.body));
                  });
  
                  client.publish({
                      destination: "/app/online-users",
                      body: username,
                  });
              },
          });
  
          client.activate();
          setStompClient(client);
  
          const handleBeforeUnload = () => {
              client.publish({
                  destination: "/app/user-disconnect",
                  body: username,
              });
          };
  
          window.addEventListener("beforeunload", handleBeforeUnload);
  
          return () => {
              window.removeEventListener("beforeunload", handleBeforeUnload);
              client.deactivate();
          };
      }
  }, [joined, username]);
  

    const handleJoin = () => {
        if (username.trim() !== "") {
            setJoined(true);
        }
    };

    const sendMessage = () => {
      if (stompClient && message.trim() !== "") {
          const chatMessage: ChatMessage = { senderName: username, message: message, type: "CHAT" };
  
          stompClient.publish({ destination: "/app/message", body: JSON.stringify(chatMessage) });
  
          setMessage(""); // Chỉ cần xóa input, không cần setMessages()
      }
  };

    const sendPrivateMessage = () => {
        if (stompClient && privateMessage.trim() !== "" && receiver.trim() !== "") {
            const chatMessage: ChatMessage = { senderName: username, receiverName: receiver, message: privateMessage, type: "PRIVATE" };

            stompClient.publish({ destination: "/app/private-message", body: JSON.stringify(chatMessage) });

            setPrivateMessages((prev) => [...prev, chatMessage]);
            setPrivateMessage("");
        }
    };

    return (
        <div className="p-5 max-w-lg mx-auto">
            {!joined ? (
                <div className="flex flex-col items-center gap-3">
                    <input
                        type="text"
                        placeholder="Nhập tên"
                        className="border p-2 rounded w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleJoin}>
                        Tham gia
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Người Dùng Online</h2>
                    <div className="border p-3 rounded h-40 overflow-y-auto">
                        {onlineUsers.map((user) => (
                            <p
                                key={user}
                                className={`cursor-pointer p-2 ${receiver === user ? "bg-blue-300" : "hover:bg-gray-100"}`}
                                onClick={() => setReceiver(user)}
                            >
                                {user}
                            </p>
                        ))}
                    </div>

                    <h2 className="text-xl font-bold">Phòng Chat</h2>
                    <div className="border p-3 rounded h-40 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <p key={index} className="text-sm">
                                <strong>{msg.senderName}: </strong> {msg.message}
                            </p>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="border p-2 flex-1 rounded"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                            Gửi
                        </button>
                    </div>

                    {receiver && (
                        <>
                            <h3 className="text-lg font-semibold">Chat Riêng Với {receiver}</h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="border p-2 flex-1 rounded"
                                        value={privateMessage}
                                        onChange={(e) => setPrivateMessage(e.target.value)}
                                    />
                                    <button
                                        className="bg-purple-500 text-white px-4 py-2 rounded"
                                        onClick={sendPrivateMessage}
                                    >
                                        Gửi Riêng
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <h3 className="text-lg font-semibold">Tin Nhắn Riêng Tư</h3>
                    <div className="border p-3 rounded h-40 overflow-y-auto">
                        {privateMessages.map((msg, index) => (
                            <p key={index} className="text-sm">
                                <strong>{msg.senderName} → {msg.receiverName}: </strong> {msg.message}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
