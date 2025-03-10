"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function UserHome() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token") // 🗑 Xóa token khỏi localStorage
    router.push("/") // 🔄 Chuyển hướng về trang đăng nhập
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome to Home</h1>
      
      <Button
        onClick={handleLogout}
        className="bg-red-600 text-white hover:bg-red-700 transition-colors px-4 py-2 rounded"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}
