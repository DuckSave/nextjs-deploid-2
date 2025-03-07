"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockIcon ,UserIcon} from "lucide-react"
import AuthAPI from "@/api/auth"
import { jwtDecode } from "jwt-decode"

function getUserRole(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token) // ✅ Giải mã JWT
    return decoded.role || null // 🔥 Lấy role từ payload của token
  } catch (error) {
    console.error("Invalid token", error)
    return null
  }
}

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null) // ✅ Lỗi password

  const router = useRouter() // ✅ Dùng để chuyển hướng

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setPasswordError(null)
  
    // Kiểm tra password có khớp không
    if (password !== confirmPassword) {
      setPasswordError("Mấy tuổi rồi còn nhập sai password nữa")
      setIsLoading(false)
      return
    }
  
    const formData = new FormData(e.target as HTMLFormElement)
    const gmail = formData.get("email") as string
    let userName = formData.get("username") as string | null
    const role = "ROLE_USER"
    userName = userName && userName.trim() !== "" ? userName : null
  
    try {
      const response = await AuthAPI.account.signUp({ gmail, password, userName, role })
  
      if (response.status === 200) {
        router.push("/sign-in") 
      } else {
        setError("Đăng ký thất bại, vui lòng thử lại!")
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
  
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Lỗi không xác định, vui lòng thử lại!")
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
          Email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
          <Input
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-black dark:text-white">
          User Name "không có cũng được"
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></span>
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            name="username"
            placeholder="Enter your username"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            autoComplete="username"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-white">Password</label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-white">Confirm Password</label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password again"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} {/* ✅ Hiển thị lỗi */}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>} {/* ✅ Hiển thị lỗi đăng nhập */}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-medium bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing up..." : "Sign up"}
      </Button>
    </form>
  )
}
