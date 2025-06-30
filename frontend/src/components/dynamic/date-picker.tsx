"use client"
import { forwardRef, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DynamicDatePickerProps {
  // Command-based parameters
  command?: string
  container_id?: string
  date_picker_id?: string
  label?: string
  default_date?: string
  min_date?: string
  max_date?: string
  date_format?: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY"

  // Additional props
  variant?: "primary" | "secondary" | "accent"
  className?: string

  // Callbacks
  onDateChange?: (date: string) => void
}

const DynamicDatePicker = forwardRef<HTMLDivElement, DynamicDatePickerProps>(
  (
    {
      className,
      command,
      container_id,
      date_picker_id,
      label,
      default_date,
      min_date,
      max_date,
      date_format = "YYYY-MM-DD",
      variant = "primary",
      onDateChange,
    },
    ref,
  ) => {
    const [selectedDate, setSelectedDate] = useState(default_date || "")
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())

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

    const formatDate = (dateString: string) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      switch (date_format) {
        case "MM/DD/YYYY":
          return date.toLocaleDateString("en-US")
        case "DD/MM/YYYY":
          return date.toLocaleDateString("en-GB")
        default:
          return dateString
      }
    }

    const handleDateSelect = (date: string) => {
      setSelectedDate(date)
      setIsOpen(false)
      onDateChange?.(date)
    }

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days = []

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
      }

      return days
    }

    const isDateDisabled = (date: Date) => {
      const dateString = date.toISOString().split("T")[0]
      if (min_date && dateString < min_date) return true
      if (max_date && dateString > max_date) return true
      return false
    }

    const days = getDaysInMonth(currentMonth)
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

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
            id={date_picker_id}
          >
            <div className="flex items-center justify-between">
              <span className={selectedDate ? "text-[#affddb]" : "text-[#94ebdf]/50"}>
                {selectedDate ? formatDate(selectedDate) : "Select a date..."}
              </span>
              <Calendar className="w-4 h-4 text-[#94ebdf]" />
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-black/40 backdrop-blur-2xl border border-[#5bc7e4]/20 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl" />

              <div className="relative z-10 p-4">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-1 hover:bg-[#5bc7e4]/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#94ebdf]" />
                  </button>
                  <span className="text-[#affddb] font-medium">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-1 hover:bg-[#5bc7e4]/10 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[#94ebdf]" />
                  </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-xs text-[#94ebdf]/70 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => day && !isDateDisabled(day) && handleDateSelect(day.toISOString().split("T")[0])}
                      disabled={!day || isDateDisabled(day)}
                      className={cn("h-8 text-sm rounded-lg transition-all duration-200", {
                        "text-[#affddb] hover:bg-[#5bc7e4]/10": day && !isDateDisabled(day),
                        "text-[#94ebdf]/30 cursor-not-allowed": !day || isDateDisabled(day),
                        "bg-[#5bc7e4]/20 text-[#affddb] font-medium":
                          day && selectedDate === day.toISOString().split("T")[0],
                      })}
                    >
                      {day?.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Backdrop to close calendar */}
        {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
      </div>
    )
  },
)

DynamicDatePicker.displayName = "DynamicDatePicker"

export { DynamicDatePicker }
