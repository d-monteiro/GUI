"use client"

import type React from "react"
import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"

interface DynamicTextInputProps {
  // Command-based parameters
  command?: string
  container_id?: string
  input_id?: string
  label?: string
  placeholder?: string
  default_value?: string
  input_type?: "text" | "email" | "password" | "number" | "tel" | "url"
  required?: boolean
  max_length?: number

  // Additional props
  variant?: "primary" | "secondary" | "accent"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  className?: string

  // Callbacks
  onValueChange?: (value: string) => void
}

const DynamicTextInput = forwardRef<HTMLInputElement, DynamicTextInputProps>(
  (
    {
      className,
      command,
      container_id,
      input_id,
      label,
      placeholder = "Enter text...",
      default_value = "",
      input_type = "text",
      required = false,
      max_length,
      variant = "primary",
      leftIcon,
      rightIcon,
      error,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState(default_value)

    const getBorderColor = () => {
      if (error) return "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/20"
      switch (variant) {
        case "secondary":
          return "border-[#78d9e2]/30 focus:border-[#78d9e2]/50 focus:ring-[#78d9e2]/20"
        case "accent":
          return "border-[#affddb]/30 focus:border-[#affddb]/50 focus:ring-[#affddb]/20"
        default:
          return "border-[#5bc7e4]/30 focus:border-[#5bc7e4]/50 focus:ring-[#5bc7e4]/20"
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <div className="space-y-2" data-container-id={container_id}>
        {label && (
          <label htmlFor={input_id} className="block text-sm font-medium text-[#affddb]">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94ebdf]">
              {leftIcon}
            </div>
          )}
          <input
            type={input_type}
            id={input_id}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            maxLength={max_length}
            className={cn(
              "block w-full rounded-2xl border bg-black/20 backdrop-blur-xl px-4 py-3 text-[#affddb] placeholder-[#94ebdf]/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:bg-black/30 shadow-lg",
              getBorderColor(),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className,
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#94ebdf]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400 bg-red-400/10 px-2 py-1 rounded">{error}</p>}
        {max_length && (
          <p className="text-xs text-[#94ebdf]/60 text-right">
            {value.length}/{max_length}
          </p>
        )}
      </div>
    )
  },
)

DynamicTextInput.displayName = "DynamicTextInput"

export { DynamicTextInput }
