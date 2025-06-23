"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DynamicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent" | "glass"
  children: React.ReactNode
}

const DynamicCard = forwardRef<HTMLDivElement, DynamicCardProps>(
  ({ className, variant = "glass", children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-3xl p-8 transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] relative overflow-hidden",
          {
            "bg-gradient-to-br from-[#5bc7e4]/10 via-black/20 to-[#38b5e5]/10 border border-[#5bc7e4]/20 backdrop-blur-2xl shadow-2xl shadow-[#5bc7e4]/5":
              variant === "primary",
            "bg-gradient-to-br from-[#78d9e2]/10 via-black/20 to-[#5bc7e4]/10 border border-[#78d9e2]/20 backdrop-blur-2xl shadow-2xl shadow-[#78d9e2]/5":
              variant === "secondary",
            "bg-gradient-to-br from-[#affddb]/10 via-black/20 to-[#94ebdf]/10 border border-[#affddb]/20 backdrop-blur-2xl shadow-2xl shadow-[#affddb]/5":
              variant === "accent",
            "bg-gradient-to-br from-black/30 via-black/20 to-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl shadow-black/20":
              variant === "glass",
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
        <div className="relative z-10">{children}</div>
      </div>
    )
  },
)
DynamicCard.displayName = "DynamicCard"

export { DynamicCard }
