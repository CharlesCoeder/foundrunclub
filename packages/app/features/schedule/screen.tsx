import { useState } from 'react'
import { XStack, YStack, Text, Button, useMedia } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Calendar } from './RunSchedule/Calendar'
import { RunList } from './RunSchedule/RunList'
import { sampleRuns } from './sampleRuns'

export function RunSchedule() {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedRun, setSelectedRun] = useState<number | null>(null)

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() + increment)
      return newMonth
    })
    setSelectedDate(undefined)
    setSelectedRun(null)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const run = sampleRuns.find((r) => r.date.toDateString() === date.toDateString())
      setSelectedRun(run ? run.id : null)
    } else {
      setSelectedRun(null)
    }
  }

  const handleRunSelect = (runId: number) => {
    setSelectedRun(runId)
    const run = sampleRuns.find((r) => r.id === runId)
    if (run) {
      setSelectedDate(run.date)
    }
  }

  const media = useMedia()

  return (
    <YStack gap="$4" padding="$4" flex={1}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="bold">
          Run Schedule
        </Text>
        <XStack gap="$2">
          <Button icon={ChevronLeft} onPress={() => changeMonth(-1)} />
          <Button icon={ChevronRight} onPress={() => changeMonth(1)} />
        </XStack>
      </XStack>
      <YStack gap="$4" flex={1}>
        {media.gtXs ? (
          <XStack gap="$4" flex={1}>
            <Calendar
              runs={sampleRuns}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              selectedRun={selectedRun}
              onDateSelect={handleDateSelect}
            />
            <RunList
              runs={sampleRuns}
              currentMonth={currentMonth}
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
            />
          </XStack>
        ) : (
          <>
            <Calendar
              runs={sampleRuns}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              selectedRun={selectedRun}
              onDateSelect={handleDateSelect}
            />
            <RunList
              key={currentMonth.toISOString()}
              runs={sampleRuns}
              currentMonth={currentMonth}
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
            />
          </>
        )}
      </YStack>
    </YStack>
  )
}
