"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface BackgroundProps {
  variant?: "gradient" | "mesh" | "dots" | "waves"
  className?: string
  children?: React.ReactNode
}

const Background = ({ variant = "gradient", className, children }: BackgroundProps) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case "mesh":
        return {
          background: `
            radial-gradient(circle at 20% 80%, #affddb 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #5bc7e4 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #78d9e2 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, #94ebdf 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, #38b5e5 0%, transparent 50%),
            #000000
          `,
        }
      case "dots":
        return {
          backgroundColor: "#000000",
          backgroundImage: `
            radial-gradient(circle, #affddb 1px, transparent 1px),
            radial-gradient(circle, #5bc7e4 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px, 30px 30px",
          backgroundPosition: "0 0, 25px 25px",
        }
      case "waves":
        return {
          background: `
            linear-gradient(45deg, #000000 25%, transparent 25%),
            linear-gradient(-45deg, #000000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #affddb 75%),
            linear-gradient(-45deg, transparent 75%, #5bc7e4 75%),
            #000000
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }
      default: // gradient
        return {
          background: `
            linear-gradient(135deg, 
              #000000 0%, 
              #001a1a 20%, 
              #002626 40%, 
              #003333 60%, 
              #001a1a 80%, 
              #000000 100%
            ),
            radial-gradient(circle at 30% 70%, rgba(175, 253, 219, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(91, 199, 228, 0.1) 0%, transparent 50%)
          `,
        }
    }
  }

  return (
    <div className={cn("min-h-screen w-full relative", className)} style={getBackgroundStyle()}>
      {/* Overlay for additional depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export { Background }
