import { useMemo } from 'react'
import { Calendar as RNCalendar, DateData } from 'react-native-calendars'
import { Card } from 'tamagui'
import { Theme } from 'react-native-calendars/src/types'

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
  const markedDates = useMemo(() => {
    const dates: {
      [key: string]: { marked: boolean; selected?: boolean; selectedColor?: string }
    } = {}

    runs.forEach((run) => {
      const dateString = run.date.toISOString().split('T')[0]
      dates[dateString] = { marked: true }
    })

    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split('T')[0]
      dates[selectedDateString] = {
        ...dates[selectedDateString],
        selected: true,
        selectedColor: 'rgba(34, 197, 94, 0.2)',
      }
    }

    return dates
  }, [runs, selectedDate])

  const handleDayPress = (day: DateData) => {
    onDateSelect(new Date(day.timestamp))
  }

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
    arrowColor: 'transparent',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  }

  return (
    <Card elevate padding="$4" width={350}>
      <RNCalendar
        key={currentMonth.toISOString()}
        current={currentMonth.toISOString()}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType={'dot'}
        theme={theme}
        enableSwipeMonths={false}
        hideArrows={true}
      />
    </Card>
  )
}
