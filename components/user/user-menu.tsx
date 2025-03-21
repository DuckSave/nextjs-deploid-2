"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  ChevronDown,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Sun,
  Moon,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function AdminMenu() {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const router = useRouter()
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }


  const handleLogout = () => {
    localStorage.removeItem("token") // 🗑 Xóa token khỏi localStorage
    router.push("/") // 🔄 Chuyển hướng về trang đăng nhập
  }

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          {/* Mobile menu trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetTitle className="sr-only">User Panel</SheetTitle> 
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="text-lg font-bold">User Panel</span>
                </div>
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/user/chat"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    Users
                  </Link>
                  <Link
                    href="/about-me"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    About Me
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="#" className="flex items-center gap-2 mr-6">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-lg font-bold hidden md:inline-block">User Panel</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="gap-1 p-0" data-state="open">
                  Chat
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[10000]">
                <DropdownMenuItem asChild>
                  <Link href="/user/chat">Chat</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/about-me" className="transition-colors hover:text-foreground/80">
              About Me
            </Link>
            
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Dark mode toggle */}
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="#" className="flex items-center gap-2">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#" className="flex items-center gap-2">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  )
}

