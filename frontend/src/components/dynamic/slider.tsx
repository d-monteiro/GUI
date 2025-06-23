"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface DynamicSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
  showValue?: boolean
  variant?: "primary" | "secondary" | "accent"
}

const DynamicSlider = forwardRef<HTMLInputElement, DynamicSliderProps>(
  ({ className, label, showValue = true, variant = "primary", value, ...props }, ref) => {
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

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[#affddb]">{label}</label>
            {showValue && <span className="text-sm text-[#94ebdf] bg-[#94ebdf]/10 px-2 py-1 rounded">{value}</span>}
          </div>
        )}
        <div className="relative">
          <input
            type="range"
            className={cn(
              "w-full h-3 bg-black/30 backdrop-blur-xl rounded-full appearance-none cursor-pointer slider border border-white/10 shadow-inner",
              className,
            )}
            style={{
              background: `linear-gradient(to right, ${getTrackColor()} 0%, ${getTrackColor()} ${((Number(value) - Number(props.min || 0)) / (Number(props.max || 100) - Number(props.min || 0))) * 100}%, #374151 ${((Number(value) - Number(props.min || 0)) / (Number(props.max || 100) - Number(props.min || 0))) * 100}%, #374151 100%)`,
            }}
            value={value}
            ref={ref}
            {...props}
          />
          <style jsx>{`
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
