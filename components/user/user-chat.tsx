"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminMenu } from "@/components/user/user-menu"

const mockUsers = [
  { id: "user1", name: "John Doe", status: "online", unread: 3 },
]

const mockMessages = [
  { id: 1, senderId: "user1", content: "Hello, I need some help with my account", timestamp: new Date().toISOString() },
  { id: 2, senderId: "me", content: "Hi there! I'd be happy to help. What seems to be the issue?", timestamp: new Date().toISOString() },
]

interface SidebarProps {
  onSelectUser: (userId: string) => void
  onLogout: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectUser, onLogout }) => {
  return (
    <div className="w-16 md:w-64 bg-card border-r transition-all duration-300">
      <div className="p-2">
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent"
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex-1 min-w-0 hidden md:block">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{user.name}</p>
              </div>
            </div>
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
}

export default function AdminChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState(mockMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || !selectedUserId) return

    const newMessage = {
      id: messages.length + 1,
      senderId: "me",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setInput("")
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const selectedUser = mockUsers.find((user) => user.id === selectedUserId)
  const selectedUserName = selectedUser ? selectedUser.name : ""

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminMenu />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectUser={setSelectedUserId} onLogout={() => console.log("Logged out")} />
        <div className="flex-1 flex">
          <Card className="w-full shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground p-2">
              <CardTitle className="text-2xl">{selectedUserId ? `Chat với ${selectedUserName}` : "Chọn một người để nhắn tin"}</CardTitle>
            </CardHeader>
            <CardContent className="h-[77vh] overflow-y-auto p-4 space-y-4">
              {messages 
                .filter((m) => m.senderId === "me" || m.senderId === selectedUserId)
                .map((m) => (
                  <div key={m.id} className={`flex ${m.senderId === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${m.senderId === "me" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"}`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="border-t p-2">
              <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Nhập tin nhắn..."
                  className="flex-grow"
                  disabled={!selectedUserId}
                />
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