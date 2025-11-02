"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  value?: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const handlePreset = (days: number) => {
    const to = new Date()
    const from = subDays(to, days)
    onChange({ from, to })
    // setOpen(false)
  }

  const handleClear = () => {
    onChange(undefined)
    // setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("bg-zinc-900 border-zinc-700 text-zinc-100 flex items-center gap-2", !value && "text-zinc-400")}
        >
          <CalendarIcon className="h-4 w-4" />
          {value?.from && value?.to
            ? `${format(value.from, "dd MMM yyyy")} - ${format(value.to, "dd MMM yyyy")}`
            : "Select Date Range"}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl w-auto shadow-lg text-zinc-100"
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          className="!bg-zinc-900 text-zinc-100 [&_button]:text-zinc-300 [&_button:hover]:bg-zinc-800"
        />

        {/* Footer buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              onClick={() => handlePreset(7)}
            >
              Last 7 Days
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              onClick={() => handlePreset(30)}
            >
              Last 30 Days
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
