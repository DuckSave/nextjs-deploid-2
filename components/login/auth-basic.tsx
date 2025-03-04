"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { AuthForm } from "./auth-form"
import { motion } from "framer-motion"
import { SocialLogin } from "./social-login"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Welcome to my DuckSave Web</title>
        {paths.map((path) => (
          <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.1 + path.id * 0.03}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{
            pathLength: 1,
            opacity: [0.3, 0.6, 0.3],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        ))}
      </svg>
    </div>
  )
}

export default function AuthBasic() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Form Container */}
      <div className="relative flex items-center justify-center p-4  dark:bg-black w-full max-w-[70%] md:max-w-[70%] lg:max-w-[70%] min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">

          {/* Image Section */}
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/to-the-moon-u5UJD9sRK8WkmaTY8HdEsNKjAQ9bjN.svg"
              alt="To the moon illustration"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="w-full space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-semibold tracking-tight text-black dark:text-white">
                  Hello!!!!
                </CardTitle>
                <CardDescription className="text-neutral-600 dark:text-neutral-400">
                  Không có tài khoản mà bấm vào đây là ăn đập liền
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AuthForm />
                <SocialLogin />
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  )
}
