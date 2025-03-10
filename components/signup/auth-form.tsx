"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockIcon, UserIcon } from "lucide-react"
import AuthAPI from "@/api/auth"
import { SusseccAlert, ErrorAlert, WarningAlert } from "@/util/AlertSW"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const router = useRouter()

  function validateForm(): boolean {
    let isValid = true

    // Kiểm tra email hợp lệ
    if (!email) {
      setEmailError("Email không được để trống , không có sao đăng nhập")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email mà không có @ là khó nói @@!")
      isValid = false
    } else {
      setEmailError(null)
    }

    // Kiểm tra mật khẩu hợp lệ
    if (!password) {
      setPasswordError("Không được để trống mật khẩu!!")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("để ít quá không được ,phải trên 6 ký tự cho ngta đừng vô :))")
      isValid = false
    } else if (password !== confirmPassword) {
      setPasswordError("Mấy tuổi rồi còn chưa nhập lại mật khẩu được vậy?")
      isValid = false
    } else {
      setPasswordError(null)
    }

    return isValid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Gọi hàm validate trước khi gửi form
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const userName = formData.get("username") as string | null
    const role = "ROLE_USER"

    try {
      const response = await AuthAPI.account.signUp({ gmail: email, password, userName, role })

      if (response.status === 200) {
        SusseccAlert("Okeeeee", "Đăng nhập thôi nào")
        router.push("/sign-in") // ✅ Chuyển đến trang đăng nhập
      } else {
        ErrorAlert("Lỗi", "Gmail này đã được đăng ký rồi!")
      }
    } catch (error: any) {
      WarningAlert("Lỗi", "Lỗi không xác định, vui lòng thử lại!")
      setError(error.response?.data?.message || "Lỗi không xác định!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Email */}
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
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            autoComplete="email"
          />
        </div>
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-black dark:text-white">
          User Name (không bắt buộc)
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            name="username"
            placeholder="Enter your username"
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            autoComplete="username"
          />
        </div>
      </div>

      {/* Password */}
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
            autoComplete="new-password"
          />
        </div>
      </div>

      {/* Confirm Password */}
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
            autoComplete="current-password"
          />
        </div>
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      </div>

      {/* Hiển thị lỗi từ API */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Nút đăng ký */}
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
