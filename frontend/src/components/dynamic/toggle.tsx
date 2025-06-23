"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DynamicToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  variant?: "primary" | "secondary" | "accent"
}

const DynamicToggle = forwardRef<HTMLInputElement, DynamicToggleProps>(
  ({ className, label, variant = "primary", checked, ...props }, ref) => {
    const getColors = () => {
      switch (variant) {
        case "secondary":
          return { bg: "#78d9e2", thumb: "#5bc7e4" }
        case "accent":
          return { bg: "#affddb", thumb: "#94ebdf" }
        default:
          return { bg: "#5bc7e4", thumb: "#38b5e5" }
      }
    }

    const colors = getColors()

    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input type="checkbox" className="sr-only" checked={checked} ref={ref} {...props} />
          <div
            className={cn(
              "w-14 h-7 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xl border shadow-lg relative overflow-hidden",
              checked
                ? "bg-gradient-to-r from-[#5bc7e4]/30 to-[#38b5e5]/30 border-[#5bc7e4]/40 shadow-[#5bc7e4]/20"
                : "bg-black/30 border-white/20 shadow-black/20",
              className,
            )}
            onClick={() => props.onChange?.({ target: { checked: !checked } } as any)}
          >
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-full" />
            <div
              className={cn(
                "absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-300 shadow-xl backdrop-blur-sm border border-white/20",
                checked
                  ? "translate-x-7 bg-gradient-to-br from-white/90 to-white/70"
                  : "translate-x-0 bg-gradient-to-br from-white/60 to-white/40",
              )}
            />
          </div>
        </div>
        {label && <label className="text-sm font-medium text-[#affddb] cursor-pointer">{label}</label>}
      </div>
    )
  },
)
DynamicToggle.displayName = "DynamicToggle"

export { DynamicToggle }
