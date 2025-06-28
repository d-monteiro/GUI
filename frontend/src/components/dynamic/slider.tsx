"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DynamicSliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "min" | "max" | "defaultValue" | "id"> {
  command?: string
  container_id?: string
  default_val?: number
  label?: string
  max_val?: number
  min_val?: number
  slider_id?: string
  variant?: "primary" | "secondary" | "accent"

  // Callback for value changes
  onValueChange?: (value: number) => void
}

const DynamicSlider = forwardRef<HTMLInputElement, DynamicSliderProps>(
  (
    {
      className,
      command,
      container_id,
      default_val = 0,
      label,
      max_val = 100,
      min_val = 0,
      variant = "primary",
      slider_id,
      value,
      onValueChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    // Use default_val if value is not provided
    const currentValue = value !== undefined ? value : default_val

    const getTrackColor = () => {
      switch (variant) {
        case "secondary":
          return "#78d9e2"
        case "accent":
          return "#affddb"
        default:
          return "#5bc7e4"
      }
    }

    const getThumbColor = () => {
      switch (variant) {
        case "secondary":
          return "#5bc7e4"
        case "accent":
          return "#94ebdf"
        default:
          return "#38b5e5"
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value)
      onValueChange?.(newValue)
      onChange?.(e)
    }

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#affddb]">{label}</label>
              <span className="text-sm text-[#94ebdf] bg-[#94ebdf]/10 px-2 py-1 rounded">
                {label?.includes("$") ? `$${currentValue.toLocaleString()}` : currentValue}
              </span>
          </div>
        )}
        <div className="relative">
          <input
            type="range"
            id={slider_id}
            min={min_val}
            max={max_val}
            value={currentValue}
            onChange={handleChange}
            className={cn(
              "w-full h-3 bg-black/30 backdrop-blur-xl rounded-full appearance-none cursor-pointer slider border border-white/10 shadow-inner",
              className,
            )}
            style={{
              background: `linear-gradient(to right, ${getTrackColor()} 0%, ${getTrackColor()} ${((Number(currentValue) - Number(min_val)) / (Number(max_val) - Number(min_val))) * 100}%, #374151 ${((Number(currentValue) - Number(min_val)) / (Number(max_val) - Number(min_val))) * 100}%, #374151 100%)`,
            }}
            ref={ref}
            {...props}
          />
          <style>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, ${getThumbColor()}, ${getThumbColor()}dd);
              cursor: pointer;
              box-shadow: 0 4px 20px rgba(91, 199, 228, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              transition: all 0.3s ease;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.15);
              box-shadow: 0 6px 25px rgba(91, 199, 228, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2);
            }
            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: ${getThumbColor()};
              cursor: pointer;
              border: none;
              box-shadow: 0 0 10px rgba(91, 199, 228, 0.3);
              transition: all 0.2s ease;
            }
            .slider::-moz-range-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 0 15px rgba(91, 199, 228, 0.5);
            }
          `}</style>
        </div>
      </div>
    )
  },
)
DynamicSlider.displayName = "DynamicSlider"

export { DynamicSlider }
