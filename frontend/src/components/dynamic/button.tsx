"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DynamicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const DynamicButton = forwardRef<HTMLButtonElement, DynamicButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5bc7e4]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 backdrop-blur-xl",
          {
            // Variants
            "bg-gradient-to-r from-[#5bc7e4]/20 to-[#38b5e5]/20 backdrop-blur-xl border border-[#5bc7e4]/30 text-[#affddb] shadow-lg shadow-[#5bc7e4]/10 hover:from-[#5bc7e4]/30 hover:to-[#38b5e5]/30 hover:shadow-xl hover:shadow-[#5bc7e4]/20 hover:border-[#5bc7e4]/50 active:scale-95":
              variant === "primary",
            "bg-gradient-to-r from-[#78d9e2]/20 to-[#5bc7e4]/20 backdrop-blur-xl border border-[#78d9e2]/30 text-[#affddb] shadow-lg shadow-[#78d9e2]/10 hover:from-[#78d9e2]/30 hover:to-[#5bc7e4]/30 hover:shadow-xl hover:shadow-[#78d9e2]/20 hover:border-[#78d9e2]/50 active:scale-95":
              variant === "secondary",
            "bg-gradient-to-r from-[#affddb]/20 to-[#94ebdf]/20 backdrop-blur-xl border border-[#affddb]/30 text-[#affddb] shadow-lg shadow-[#affddb]/10 hover:from-[#affddb]/30 hover:to-[#94ebdf]/30 hover:shadow-xl hover:shadow-[#affddb]/20 hover:border-[#affddb]/50 active:scale-95":
              variant === "accent",
            "bg-black/10 backdrop-blur-xl border border-[#affddb]/20 text-[#affddb] hover:bg-[#affddb]/10 hover:border-[#affddb]/40 hover:shadow-lg hover:shadow-[#affddb]/10":
              variant === "ghost",
            "bg-black/20 backdrop-blur-xl border-2 border-[#5bc7e4]/40 text-[#5bc7e4] hover:bg-[#5bc7e4]/10 hover:border-[#5bc7e4]/60 hover:shadow-lg hover:shadow-[#5bc7e4]/20":
              variant === "outline",
            // Sizes
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-base": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
DynamicButton.displayName = "DynamicButton"

export { DynamicButton }
