"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/user/user-menu"

// Mock user data - in a real app, this would come from your database
const mockUsers = [
  { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40", status: "online" },

]

// Mock current user data
const currentUser = {
  id: "user_123",
  name: "Current User",
  email: "user@example.com",
  avatar: "/placeholder.svg?height=40&width=40",
}

interface SidebarProps {
  onSelectUser?: (userId: string) => void
  onLogout?: () => void
}

export function Sidebar({ onSelectUser, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = mockUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-background transition-all duration-300 ease-in-out",
        "flex flex-col h-full",
        isOpen ? "w-64" : "w-16",
      )}
    >
      {/* Toggle button */}
      <Button variant="ghost" size="icon" className="absolute -right-4 top-2 z-50" onClick={toggleSidebar}>
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* User Menu */}
      <div className="p-2 border-b">
        <UserMenu user={currentUser} isCollapsed={!isOpen} onLogout={() => onLogout && onLogout()} />
      </div>

      {/* Search section */}
      <div className={cn("p-4 border-b", !isOpen && "hidden")}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users list */}
      <div className="flex-grow overflow-y-auto p-2">
        <h3 className={cn("text-sm font-medium text-muted-foreground mb-2 px-2", !isOpen && "hidden")}>Admin</h3>
        {filteredUsers.length > 0 ? (
          <ul className="space-y-1">
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start px-2 py-6", !isOpen && "justify-center px-0")}
                  onClick={() => onSelectUser && onSelectUser(user.id)}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOpen && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "ml-auto h-2 w-2 rounded-full",
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-300",
                      !isOpen && "ml-0",
                    )}
                  />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={cn("text-center text-muted-foreground text-sm py-4", !isOpen && "hidden")}>No users found</p>
        )}
      </div>
    </div>
  )
}

