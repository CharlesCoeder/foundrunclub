import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Card } from 'tamagui'

interface CalendarProps {
  runs: Array<{ id: number; date: Date }>
  currentMonth: Date
  selectedDate: Date | undefined
  selectedRun: number | null
  onDateSelect: (date: Date | undefined) => void
}

export function Calendar({
  runs,
  currentMonth,
  selectedDate,
  selectedRun,
  onDateSelect,
}: CalendarProps) {
  const isDayWithRun = (date: Date) => {
    return runs.some((run) => run.date.toDateString() === date.toDateString())
  }

  return (
    <Card elevate padding="$4" width={350}>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        month={currentMonth}
        hideNavigation
        modifiers={{
          hasRun: isDayWithRun,
          selected: (date) =>
            selectedRun !== null &&
            runs.find((r) => r.id === selectedRun)?.date.toDateString() === date.toDateString(),
        }}
        modifiersStyles={{
          hasRun: { backgroundColor: 'rgba(59, 130, 246, 0.1)', fontWeight: 'bold' },
          selected: {
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            color: 'rgb(21, 128, 61)',
            fontWeight: 'bold',
          },
        }}
      />
    </Card>
  )
}
