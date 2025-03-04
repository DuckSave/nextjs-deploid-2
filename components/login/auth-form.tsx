"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockIcon } from "lucide-react"
import AuthAPI from "@/api/auth"
export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() // ✅ Dùng để chuyển hướng

  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const gmail = formData.get("email") as string
    const password = formData.get("password") as string
    try {
      // ✅ Gọi API đăng nhập
      const response = await AuthAPI.account.signIn({ gmail, password })
      const token = response.data.token
      const role = response.data.role // 🎯 Lấy role từ API
      console.log("API Response:", response)
      if(response.status === 200) {
        // ✅ Lưu token vào localStorage
        localStorage.setItem("token", token)
        localStorage.setItem("role", role)
        console.log(response.data)
        if(role === true){ 
          router.push("/admin/dashboard")
        }else{ 
          router.push("/user/home")
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("Email hoặc mật khẩu không đúng!")
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
        <label className="text-sm font-medium text-black dark:text-white">Password</label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>} {/* ✅ Hiển thị lỗi */}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-medium bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

