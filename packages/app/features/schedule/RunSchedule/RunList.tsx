import { useMemo } from 'react'
import { Card, YStack, XStack, Text, ScrollView } from 'tamagui'
import { MapPin, Clock, Ruler } from '@tamagui/lucide-icons'

interface Run {
  id: number
  date: Date
  distance: string
  time: string
  location: string
  pace: string
}

interface RunListProps {
  runs: Run[]
  currentMonth: Date
  selectedRun: number | null
  onRunSelect: (runId: number) => void
}

export function RunList({ runs, currentMonth, selectedRun, onRunSelect }: RunListProps) {
  

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
          <YStack gap="$2">
            {filteredRuns.map((run) => (
              <Card
                key={run.id}
                padding="$2"
                pressStyle={{ backgroundColor: '$backgroundHover' }}
                backgroundColor={selectedRun === run.id ? '$green2' : undefined}
                onPress={() => onRunSelect(run.id)}
              >
                <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
                  <Text fontWeight="bold">
                    {run.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text fontSize="$2" color="$blue10">
                    {run.distance}
                  </Text>
                </XStack>
                <XStack alignItems="center" marginBottom="$1">
                  <Clock size={16} />
                  <Text fontSize="$2" marginLeft="$1">
                    {run.time}
                  </Text>
                </XStack>
                <XStack alignItems="center" marginBottom="$1">
                  <MapPin size={16} />
                  <Text fontSize="$2" marginLeft="$1">
                    {run.location}
                  </Text>
                </XStack>
                <XStack alignItems="center">
                  <Ruler size={16} />
                  <Text fontSize="$2" marginLeft="$1">
                    Pace: {run.pace}
                  </Text>
                </XStack>
              </Card>
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </Card>
  )
}
