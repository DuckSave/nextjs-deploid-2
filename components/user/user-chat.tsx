"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminMenu } from "@/components/user/user-menu"
import { jwtDecode } from "jwt-decode"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const mockUsers = [{ id: "67cabe7847d75855dda56975", name: "Admin" }]

interface Message {
  id: number
  senderId: string
  receiverId: string
  content: string
  timestamp: string
}

const Sidebar: React.FC<{ onSelectUser: (userId: string) => void; onLogout: () => void }> = ({ onSelectUser, onLogout }) => (
  <div className="w-16 md:w-64 bg-card border-r transition-all duration-300">
    <div className="p-2">
      {mockUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent" onClick={() => onSelectUser(user.id)}>
          <p className="font-medium truncate">{user.name}</p>
        </div>
      ))}
    </div>
    <div className="p-4 border-t">
      <Button variant="outline" size="icon" className="md:hidden mx-auto flex" onClick={onLogout}>
        <Send className="size-4" />
      </Button>
    </div>
  </div>
)

export default function UserPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUserId(decoded.userId || decoded.sub)
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (!userId) return;
  
    const stompClient = new Client({
      webSocketFactory: () => new SockJS("https://3.107.182.209:8080/ws"),
      onConnect: () => {
        console.log("✅ Kết nối WebSocket thành công!");
    
        stompClient.subscribe(`/user/${userId}/private`, (message) => {
          console.log("📩 Tin nhắn nhận được từ server:", message.body);
          const receivedMessage = JSON.parse(message.body);
          console.log("📩 Nội dung tin nhắn:", receivedMessage);
        });
    
        console.log("📡 Đã subscribe tới: /user/queue/messages");
      },
      onStompError: (frame) => {
        console.error("❌ Lỗi WebSocket:", frame);
      }
    });
    
    stompClient.activate();
    setClient(stompClient);
  
    return () => {
      stompClient.deactivate();
    };
  }, [userId, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !selectedUserId || !userId || !client) return;
  
    const newMessage = {
      senderId: userId,
      receiverId: selectedUserId,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
  
    client.publish({
      destination: "/app/chat",
      body: JSON.stringify(newMessage),
    });
  
    // Thêm tin nhắn vào state để hiển thị ngay lập tức
    setMessages((prev) => [...prev, { ...newMessage, id: prev.length + 1 }]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminMenu />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectUser={setSelectedUserId} onLogout={() => console.log("Logged out")} />
        <div className="flex-1 flex">
          <Card className="w-full shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground p-2">
              <CardTitle className="text-2xl">{selectedUserId ? `Chat với ${mockUsers.find((u) => u.id === selectedUserId)?.name}` : "Chọn một người để nhắn tin"}</CardTitle>
            </CardHeader>
            <CardContent className="h-[77vh] overflow-y-auto p-4 space-y-4">
                {messages
                  .filter((m) =>
                    (m.senderId === userId && m.receiverId === selectedUserId) ||
                    (m.senderId === selectedUserId && m.receiverId === userId)
                  )
                  .map((m) => (
                    <div key={m.id} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          m.senderId === userId ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </CardContent>
            <CardFooter className="border-t p-2">
              <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-grow" disabled={!selectedUserId} />
                <Button type="submit" disabled={!selectedUserId || !input.trim()}>
                  <Send className="size-4 mr-2" />
                  Gửi
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
