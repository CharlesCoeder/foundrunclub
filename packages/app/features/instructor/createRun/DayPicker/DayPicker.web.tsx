import { useState } from 'react'
import { DayPicker as RDPDayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Card } from 'tamagui'

interface DayPickerProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  month?: Date
}

export function DayPicker({ selected, onSelect, month: initialMonth }: DayPickerProps) {
  const [month, setMonth] = useState<Date>(initialMonth || new Date())

  return (
    <Card elevate padding="$4" width={350}>
      <RDPDayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        month={month}
        onMonthChange={setMonth}
      />
    </Card>
  )
}
