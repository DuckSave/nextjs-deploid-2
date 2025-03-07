"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockIcon } from "lucide-react"
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const router = useRouter()

  // ✅ Hàm kiểm tra form trước khi gửi API
  function validateForm(): boolean {
    let isValid = true

    // Kiểm tra email không được để trống
    if (!email.trim()) {
      setEmailError("Email để trống sao đăng nhập!")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email không hợp lệ! Phải có @")
      isValid = false
    } else {
      setEmailError(null)
    }

    // Kiểm tra mật khẩu không được để trống
    if (!password.trim()) {
      setPasswordError("Mật khẩu để trống đăng nhập bằng mạng người nha!")
      isValid = false
    }else {
      setPasswordError(null)
    }

    return isValid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // ✅ Gọi hàm validate trước khi gửi API
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await AuthAPI.account.signIn({ gmail: email, password })

      if (response.status !== 200) {
        setError("Đăng nhập thất bại, vui lòng thử lại!")
        return
      }

      const token = response.data.token
      localStorage.setItem("token", token) // ✅ Chỉ lưu token

      // 🎯 Lấy role từ token sau khi giải mã
      const role = getUserRole(token)

      if (role === "ROLE_ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/home")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("Email hoặc mật khẩu không đúng!")
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000) // ✅ Loading lâu hơn 2 giây
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
          Email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateForm} // ✅ Kiểm tra khi rời khỏi ô nhập
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            autoComplete="email"
          />
        </div>
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-white">Password</label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validateForm} // ✅ Kiểm tra khi rời khỏi ô nhập
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      </div>

      {/* Hiển thị lỗi API */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Nút đăng nhập */}
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
