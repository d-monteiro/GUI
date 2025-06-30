"use client"
import { forwardRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownOption {
  value: string
  label: string
}

interface DynamicDropdownProps {
  // Command-based parameters
  command?: string
  container_id?: string
  dropdown_id?: string
  label?: string
  options: DropdownOption[]
  default_value?: string
  placeholder?: string

  // Additional props
  variant?: "primary" | "secondary" | "accent"
  className?: string

  // Callbacks
  onValueChange?: (value: string) => void
}

const DynamicDropdown = forwardRef<HTMLDivElement, DynamicDropdownProps>(
  (
    {
      className,
      command,
      container_id,
      dropdown_id,
      label,
      options,
      default_value,
      placeholder = "Select an option...",
      variant = "primary",
      onValueChange,
    },
    ref,
  ) => {
    const [selectedValue, setSelectedValue] = useState(default_value || "")
    const [isOpen, setIsOpen] = useState(false)

    const getBorderColor = () => {
      switch (variant) {
        case "secondary":
          return "border-[#78d9e2]/30 focus-within:border-[#78d9e2]/50"
        case "accent":
          return "border-[#affddb]/30 focus-within:border-[#affddb]/50"
        default:
          return "border-[#5bc7e4]/30 focus-within:border-[#5bc7e4]/50"
      }
    }

    const getHighlightColor = () => {
      switch (variant) {
        case "secondary":
          return "hover:bg-[#78d9e2]/10 data-[selected=true]:bg-[#78d9e2]/20"
        case "accent":
          return "hover:bg-[#affddb]/10 data-[selected=true]:bg-[#affddb]/20"
        default:
          return "hover:bg-[#5bc7e4]/10 data-[selected=true]:bg-[#5bc7e4]/20"
      }
    }

    const handleSelect = (value: string) => {
      setSelectedValue(value)
      setIsOpen(false)
      onValueChange?.(value)
    }

    const selectedOption = options.find((option) => option.value === selectedValue)

    return (
      <div className="space-y-2" data-container-id={container_id}>
        {label && <label className="block text-sm font-medium text-[#affddb]">{label}</label>}

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full px-4 py-3 text-left bg-black/20 backdrop-blur-xl border rounded-2xl text-[#affddb] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#5bc7e4]/20 shadow-lg",
              getBorderColor(),
              className,
            )}
            id={dropdown_id}
          >
            <div className="flex items-center justify-between">
              <span className={selectedOption ? "text-[#affddb]" : "text-[#94ebdf]/50"}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronDown
                className={cn("w-4 h-4 text-[#94ebdf] transition-transform duration-200", {
                  "rotate-180": isOpen,
                })}
              />
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-black/40 backdrop-blur-2xl border border-[#5bc7e4]/20 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl" />

              <div className="relative z-10 max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-4 py-3 text-left text-[#affddb] transition-all duration-200 flex items-center justify-between",
                      getHighlightColor(),
                    )}
                    data-selected={selectedValue === option.value}
                  >
                    <span>{option.label}</span>
                    {selectedValue === option.value && <Check className="w-4 h-4 text-[#5bc7e4]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Backdrop to close dropdown */}
        {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
      </div>
    )
  },
)

DynamicDropdown.displayName = "DynamicDropdown"

export { DynamicDropdown }
export type { DropdownOption }
