"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DynamicTextProps extends React.HTMLAttributes<HTMLDivElement> {
  // Command-based parameters
  command?: string
  container_id?: string
  text: string
  style: "header" | "body" | "code"

  // Additional props
  variant?: "primary" | "secondary" | "accent"
  className?: string
}

const DynamicText = forwardRef<HTMLDivElement, DynamicTextProps>(
  ({ className, command, container_id, text, style, variant = "primary", ...props }, ref) => {
    const getTextStyles = () => {
      const baseStyles = "transition-all duration-300"

      switch (style) {
        case "header":
          return cn(baseStyles, "text-2xl md:text-3xl lg:text-4xl font-bold leading-tight", {
            "bg-gradient-to-r from-[#affddb] via-[#94ebdf] to-[#5bc7e4] bg-clip-text text-transparent":
              variant === "primary",
            "bg-gradient-to-r from-[#78d9e2] via-[#5bc7e4] to-[#38b5e5] bg-clip-text text-transparent":
              variant === "secondary",
            "bg-gradient-to-r from-[#affddb] via-[#94ebdf] to-[#78d9e2] bg-clip-text text-transparent":
              variant === "accent",
          })

        case "code":
          return cn(
            baseStyles,
            "font-mono text-sm md:text-base bg-black/40 backdrop-blur-xl border border-[#5bc7e4]/20 rounded-xl px-4 py-3 text-[#affddb] shadow-lg",
            {
              "border-[#5bc7e4]/20 text-[#affddb]": variant === "primary",
              "border-[#78d9e2]/20 text-[#94ebdf]": variant === "secondary",
              "border-[#affddb]/20 text-[#affddb]": variant === "accent",
            },
          )

        case "body":
        default:
          return cn(baseStyles, "text-base md:text-lg leading-relaxed", {
            "text-white": variant === "primary",
            "text-[#94ebdf]": variant === "secondary",
            "text-[#affddb]": variant === "accent",
          })
      }
    }

    const getContainerStyles = () => {
      if (style === "code") {
        return "inline-block"
      }
      return "block"
    }

    const renderText = () => {
      const textStyles = getTextStyles()

      switch (style) {
        case "header":
          return (
            <h1 className={textStyles} {...props} ref={ref}>
              {text}
              {/* Glow effect for headers */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#affddb]/10 via-[#5bc7e4]/10 to-[#38b5e5]/10 blur-3xl -z-10 rounded-full opacity-50" />
            </h1>
          )

        case "code":
          return (
            <code className={textStyles} {...props} ref={ref}>
              {text}
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-xl" />
            </code>
          )

        case "body":
        default:
          return (
            <p className={textStyles} {...props} ref={ref}>
              {text}
            </p>
          )
      }
    }

    return (
      <div className={cn("relative", getContainerStyles(), className)} data-container-id={container_id}>
        {renderText()}
      </div>
    )
  },
)

DynamicText.displayName = "DynamicText"

export { DynamicText }
