import { useState, useEffect } from 'react'
import { XStack, YStack, Text, Button, useMedia } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { Calendar } from './RunSchedule/Calendar'
import { RunList } from './RunSchedule/RunList'
import { useFetchRuns } from 'app/utils/supabase/fetchRuns'
import { Run } from 'app/types/run'
export function RunSchedule() {
  const { fetchRuns } = useFetchRuns()
  const [runs, setRuns] = useState<Run[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedRun, setSelectedRun] = useState<number | null>(null)

  useEffect(() => {
    const loadRuns = async () => {
      try {
        const runsData = await fetchRuns()
        setRuns(runsData)
      } catch (error) {
        console.error('Failed to fetch runs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadRuns()
  }, [fetchRuns])

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
      const run = runs.find((r) => r.date.toDateString() === date.toDateString())
      setSelectedRun(run ? run.id : null)
    } else {
      setSelectedRun(null)
    }
  }

  const handleRunSelect = (runId: number) => {
    setSelectedRun(runId)
    const run = runs.find((r) => r.id === runId)
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
              runs={runs}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              selectedRun={selectedRun}
              onDateSelect={handleDateSelect}
              isLoading={isLoading}
            />
            <RunList
              runs={runs}
              currentMonth={currentMonth}
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
              isLoading={isLoading}
            />
          </XStack>
        ) : (
          <>
            <Calendar
              runs={runs}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              selectedRun={selectedRun}
              onDateSelect={handleDateSelect}
              isLoading={isLoading}
            />
            <RunList
              key={currentMonth.toISOString()}
              runs={runs}
              currentMonth={currentMonth}
              selectedRun={selectedRun}
              onRunSelect={handleRunSelect}
              isLoading={isLoading}
            />
          </>
        )}
      </YStack>
    </YStack>
  )
}
