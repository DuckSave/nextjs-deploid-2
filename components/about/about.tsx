"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Facebook, Linkedin, Mail, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/components/hook/useMediaQuery"

export default function AboutMe() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/c3/71/70/c371709581e8cca01a171f99f5b0ee7e.jpg')",
            filter: "brightness(0.4)",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        <div className="container relative z-10 px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div
              style={{
                backgroundImage:
                  "url('https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/453850270_2182062522179982_3862365869108220431_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=c5Ota69bhp8Q7kNvgGvqhmy&_nc_oc=AdmHeBzr_-HK7PByOYXC_NwWAnDGW2bzkWpBLzMRemhx2TFHgmN4IBFtUENTXYKpuvUNYzpsLmF9Xoolo8jUkjIK&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=-F58GG_RPNcqmAKaoJ0FJQ&oh=00_AYFup_Sh_qLJ64xBiUWcAyQ6FuYX1M7tppKKSS-05nMi7g&oe=67E3638A')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: isMobile ? "120px" : "150px",
                height: isMobile ? "120px" : "150px",
                margin: "0 auto",
              }}
              className="rounded-full border-4 border-primary shadow-lg"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4"
          >
            DuckSave
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-2xl text-primary mb-6 md:mb-8"
          >
            Web Developer & Designer
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center space-x-3 md:space-x-4 mb-8 md:mb-12"
          >
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              className="rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
            >
              <Github className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              className="rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
            >
              <Facebook className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              className="rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
            >
              <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              className="rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40"
            >
              <Mail className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button
              variant="default"
              className="rounded-full px-6 py-2 md:px-8 md:py-6 text-sm md:text-lg"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                })
              }}
            >
              Learn More About Me
              <ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5 animate-bounce" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Về mình</h2>
            <div className="w-16 md:w-20 h-1 bg-primary mx-auto mb-6 md:mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="flex justify-center"
            >
              <div
                style={{
                  backgroundImage: "url('https://i.pinimg.com/736x/5d/fa/00/5dfa006a33fdcd98b9b4dc7e125acf3e.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "100%",
                  maxWidth: "500px",
                  height: isMobile ? "350px" : "600px",
                  borderRadius: "12px",
                }}
                className="shadow-lg"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="px-2 md:px-0"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4">À thì.... , xin chào mình là Đức Lưu</h3>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Cảm hứng mình làm ra sản phẩm này là.... có 1 bạn , xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </p>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </p>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Và yên tâm rằng là sản phẩm này khi các bạn hỏi hoặc nhắn với ĐL Fake thì hoàn toàn là AI chat , và đặt
                biệt là nó giống mình 100%, về cách ăn nói chuyện hiền lành và nhiều thứ khác, nhưng mà đôi khi sẽ là ĐL real =))
              </p>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Mọi thứ sẽ trả lời là 100% sự thật nhé ,"TẤT CẢ MỌI THỨ VỀ ĐL".
              </p>
              <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                Nhưng mà vẫn còn một xíu hạn chế là nó sẽ hoạt động tùy lúc =))) ,tin nhắn của mọi người sẽ
                không được lưu lại , kể cả ĐL fake cũng sẽ không lưu. Tránh trường hợp ĐL real vào xem tin nhắn của mọi
                người hỏi =))))
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 bg-secondary/10">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Liên hệ với mình</h2>
            <div className="w-16 md:w-20 h-1 bg-primary mx-auto mb-6 md:mb-8"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Mọi ý kiến góp ý của mọi người sẽ giúp tôi phát triển trang này lên một cách tốt nhất
            </p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Thông tin liên hệ</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Email</h4>
                    <p className="text-muted-foreground text-sm md:text-base break-all">ducluu1705@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 md:h-6 md:w-6 text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Phone</h4>
                    <p className="text-muted-foreground text-sm md:text-base">0911835993</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 md:h-6 md:w-6 text-primary"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm md:text-base">Địa chỉ</h4>
                    <p className="text-muted-foreground text-sm md:text-base">Không cho =))))</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-border">
                <h4 className="font-medium text-sm md:text-base mb-3">Theo dõi tôi</h4>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Github className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 bg-muted text-center">
        <div className="container px-4 sm:px-6">
          <p className="text-xs md:text-sm">
            © dự án hoàn thành 21/3/2025
          </p>
        </div>
      </footer>
    </div>
  )
}

