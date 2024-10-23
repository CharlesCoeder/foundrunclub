import { useMemo } from 'react'
import { Card, YStack, Text, ScrollView } from '@my/ui'
import { Run } from 'app/types/run'
import { RunCard } from './RunCard'

interface RunListProps {
  runs: Run[]
  currentMonth: Date
  selectedRun: number | null
  onRunSelect: (runId: number) => void
  isLoading: boolean
}

export function RunList({ runs, currentMonth, selectedRun, onRunSelect, isLoading }: RunListProps) {
  const filteredRuns = useMemo(() => {
    return runs.filter(
      (run) =>
        run.date.getMonth() === currentMonth.getMonth() &&
        run.date.getFullYear() === currentMonth.getFullYear()
    )
  }, [runs, currentMonth])

  return (
    <Card flex={1}>
      <YStack padding="$4" flex={1}>
        <Text fontSize="$5" fontWeight="bold" marginBottom="$2">
          Upcoming Runs -{' '}
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <ScrollView flex={1}>
          {isLoading ? (
            <Text>Loading runs...</Text>
          ) : filteredRuns.length === 0 ? (
            <Text>No runs scheduled for this month</Text>
          ) : (
            <YStack gap="$2">
              {filteredRuns.map((run) => (
                <RunCard
                  key={run.id}
                  run={run}
                  isSelected={selectedRun === run.id}
                  onSelect={onRunSelect}
                />
              ))}
            </YStack>
          )}
        </ScrollView>
      </YStack>
    </Card>
  )
}
