"use client"
import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatRoom = () => {
  const [privateChats, setPrivateChats] = useState(new Map());
  interface ChatMessage {
    senderName: string;
    message: string;
    status: string;
  }
  
  const [publicChats, setPublicChats] = useState<ChatMessage[]>([]);
  const [tab, setTab] = useState("CHATROOM");
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect = () => {
    const socket = new SockJS("https://3.107.182.209:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: onConnected,
      onStompError: onError,
    });

    stompClientRef.current = client;
    client.activate();
  };

  const onConnected = () => {
    setUserData((prev) => ({ ...prev, connected: true }));
    const client = stompClientRef.current;

    if (client) {
      client.subscribe("/chatroom/public", onMessageReceived);
      client.subscribe(`/user/${userData.username}/private`, onPrivateMessage);
    }

    userJoin();
  };

  const userJoin = () => {
    const client = stompClientRef.current;
    if (client) {
      const chatMessage = {
        senderName: userData.username,
        status: "JOIN",
      };
      client.publish({
        destination: "/app/message",
        body: JSON.stringify(chatMessage),
      });
    }
  };

  const onMessageReceived = (message: { body: string }) => {
    const payloadData = JSON.parse(message.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.get(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "MESSAGE":
        setPublicChats((prev) => [...prev, payloadData]);
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (message: { body: string }) => {
    const payloadData = JSON.parse(message.body);
  
    setPrivateChats((prevChats) => {
      const updatedChats = new Map(prevChats);
      const messages = updatedChats.get(payloadData.senderName) || [];
  
      // Kiểm tra xem tin nhắn đã tồn tại chưa, nếu có thì không thêm vào nữa
      if (!messages.some((msg: ChatMessage) => msg.message === payloadData.message && msg.senderName === payloadData.senderName)) {
        updatedChats.set(payloadData.senderName, [...messages, payloadData]);
      }
  
      return new Map(updatedChats);
    });
  };

  const onError = (error: any) => {
    console.error("WebSocket Error: ", error);
  };

  const sendValue = () => {
    const client = stompClientRef.current;
    if (client) {
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: "MESSAGE",
      };
      client.publish({
        destination: "/app/message",
        body: JSON.stringify(chatMessage),
      });
      setUserData((prev) => ({ ...prev, message: "" }));
    }
  };

  const sendPrivateValue = () => {
    const client = stompClientRef.current;
    if (client?.connected && userData.username && tab) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: "MESSAGE",
      };
  
      // Cập nhật state một cách an toàn
      setPrivateChats((prevChats) => {
        const updatedChats = new Map(prevChats);
        const messages = updatedChats.get(tab) || [];
  
        // Kiểm tra xem tin nhắn có bị lặp hay không trước khi thêm
        if (!messages.some((msg: ChatMessage) => msg.message === chatMessage.message && msg.senderName === chatMessage.senderName)) {
          updatedChats.set(tab, [...messages, chatMessage]);
        }
  
        return new Map(updatedChats);
      });
  
      // Gửi tin nhắn qua WebSocket
      client.publish({
        destination: "/app/private-message",
        body: JSON.stringify(chatMessage),
      });
  
      setUserData((prev) => ({ ...prev, message: "" }));
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {!userData.connected ? (
        <div className="flex flex-col items-center justify-center h-full">
          <input type="text" placeholder="Enter your name" className="px-4 py-2 border rounded-lg focus:outline-none" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={connect}>Connect</button>
        </div>
      ) : (
        <div className="flex h-full">
          <aside className="w-1/4 bg-white p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <ul>
              <li className={`p-2 cursor-pointer ${tab === "CHATROOM" ? "bg-blue-500 text-white" : ""}`} onClick={() => setTab("CHATROOM")}>Chatroom</li>
              {[...privateChats.keys()].map((name, index) => (
                <li key={index} className={`p-2 cursor-pointer ${tab === name ? "bg-blue-500 text-white" : ""}`} onClick={() => setTab(name)}>{name}</li>
              ))}
            </ul>
          </aside>
          <main className="flex-1 flex flex-col bg-white shadow-lg">
            <div className="flex-1 p-4 overflow-y-auto">
              {(tab === "CHATROOM" ? publicChats : privateChats.get(tab) || []).map((chat: ChatMessage, index: number) => (
                <div key={index} className={`p-2 rounded-lg my-1 ${chat.senderName === userData.username ? "bg-blue-100 ml-auto" : "bg-gray-200"}`}>
                  <span className="font-bold">{chat.senderName}: </span>{chat.message}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input type="text" className="flex-1 p-2 border rounded-lg focus:outline-none" placeholder="Type a message..." value={userData.message} onChange={(e) => setUserData({ ...userData, message: e.target.value })} />
              <button className="ml-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={tab === "CHATROOM" ? sendValue : sendPrivateValue}>Send</button>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
