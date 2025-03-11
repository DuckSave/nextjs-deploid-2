"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar"

interface Message {
  id: string
  senderId: string
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || !selectedUserId) return

    setMessages([...messages, { id: Date.now().toString(), senderId: "me", content: input }])
    setInput("")
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onSelectUser={setSelectedUserId} onLogout={() => console.log("Logged out")} />
      <div className="flex-1 flex items-center justify-center p-4 ml-16 md:ml-64 transition-all duration-300">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle>{selectedUserId ? `Chat với ${selectedUserId}` : "Chọn một người để nhắn tin"}</CardTitle>
          </CardHeader>
          <CardContent className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages
              .filter((m) => m.senderId === "me" || m.senderId === selectedUserId)
              .map((m) => (
                <div key={m.id} className={`flex ${m.senderId === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${m.senderId === "me" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
          </CardContent>
          <CardFooter className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input value={input} onChange={handleInputChange} placeholder="Nhập tin nhắn..." className="flex-grow" disabled={!selectedUserId} />
              <Button type="submit" disabled={!selectedUserId || !input.trim()}>
                <Send className="size-4 mr-2" />
                Gửi
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
