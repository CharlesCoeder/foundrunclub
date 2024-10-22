import { useState } from 'react'
import { Calendar } from 'react-native-calendars'
import { Card } from 'tamagui'
import type { Theme } from 'react-native-calendars/src/types'

interface DayPickerProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  month?: Date
}

export function DayPicker({ selected, onSelect, month }: DayPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(month || new Date())

  const theme: Theme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: 'rgba(34, 197, 94, 0.2)',
    selectedDayTextColor: '#000000',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    monthTextColor: 'black',
    indicatorColor: 'blue',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  }

  const markedDates = selected
    ? {
        [selected.toISOString().split('T')[0]]: {
          selected: true,
          selectedColor: 'rgba(34, 197, 94, 0.2)',
        },
      }
    : {}

  return (
    <Card elevate padding="$4" width={350}>
      <Calendar
        current={currentMonth.toISOString()}
        onDayPress={(day) => onSelect?.(new Date(day.timestamp))}
        markedDates={markedDates}
        theme={theme}
        onMonthChange={(month) => setCurrentMonth(new Date(month.timestamp))}
      />
    </Card>
  )
}
