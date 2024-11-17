import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { H2, Paragraph, YStack, XStack, Spinner, Accordion } from '@my/ui'
import { ChevronDown } from '@tamagui/lucide-icons'
import { useFetchUserAttendance, AttendedRun } from 'app/utils/attendance/fetchUserAttendance'
import { formatDistance, formatDateAbbrev, formatTime } from 'app/utils/formatters'

export function AttendedRuns({ userId }: { userId: string }) {
  const [runs, setRuns] = useState<AttendedRun[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchAttendedRuns } = useFetchUserAttendance()

  useEffect(() => {
    if (userId) {
      loadRuns()
    }
  }, [userId])

  const loadRuns = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const attendedRuns = await fetchAttendedRuns(userId)
      setRuns(attendedRuns)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attended runs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <YStack padding="$4" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack padding="$4">
        <Paragraph color="$red10">Error: {error}</Paragraph>
      </YStack>
    )
  }

  return (
    <YStack padding="$4" gap="$4">
      <H2> Run History ({runs.length})</H2>
      <ScrollView>
        {runs.length === 0 ? (
          <Paragraph>You haven't attended any runs yet.</Paragraph>
        ) : (
          <YStack gap="$3">
            {runs.map((run) => (
              <Accordion type="single" collapsible key={`${run.id}-${run.attended_at}`}>
                <Accordion.Item value={run.id.toString()}>
                  <Accordion.Trigger
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$4"
                    paddingHorizontal="$4"
                    paddingVertical="$4"
                    hoverStyle={{ backgroundColor: '$backgroundHover' }}
                    pressStyle={{ backgroundColor: '$backgroundPress' }}
                  >
                    {({ open }) => (
                      <XStack width="100%" justifyContent="space-between" alignItems="center">
                        <Paragraph size="$5" fontWeight="600">
                          {formatDateAbbrev(run.date)}
                        </Paragraph>
                        <XStack gap="$2" alignItems="center">
                          <Paragraph size="$5" color="$color">
                            {formatDistance(run.distance)}
                          </Paragraph>
                          <ChevronDown size={18} color="$color" />
                        </XStack>
                      </XStack>
                    )}
                  </Accordion.Trigger>

                  <Accordion.Content
                    backgroundColor="$background"
                    borderWidth={1}
                    borderTopWidth={0}
                    borderColor="$borderColor"
                    borderBottomLeftRadius="$4"
                    borderBottomRightRadius="$4"
                    paddingHorizontal="$4"
                    paddingVertical="$4"
                  >
                    <YStack gap="$4">
                      <XStack gap="$4">
                        <YStack flex={1}>
                          <Paragraph size="$4" color="$color">
                            Time
                          </Paragraph>
                          <Paragraph size="$4">{formatTime(run.time)}</Paragraph>
                        </YStack>

                        {run.target_pace && (
                          <YStack flex={1}>
                            <Paragraph size="$4" color="$color">
                              Target Pace
                            </Paragraph>
                            <Paragraph size="$4">{run.target_pace}</Paragraph>
                          </YStack>
                        )}
                      </XStack>

                      {run.meetup_location && (
                        <YStack>
                          <Paragraph size="$4" color="$color">
                            Location
                          </Paragraph>
                          <Paragraph size="$4">{run.meetup_location}</Paragraph>
                        </YStack>
                      )}

                      {run.route && (
                        <YStack>
                          <Paragraph size="$4" color="$color">
                            Route
                          </Paragraph>
                          <Paragraph size="$4">{run.route}</Paragraph>
                        </YStack>
                      )}

                      <YStack>
                        <Paragraph size="$4" color="$color">
                          Attended
                        </Paragraph>
                        <Paragraph size="$4">
                          {formatDateAbbrev(new Date(run.attended_at))}
                        </Paragraph>
                      </YStack>
                    </YStack>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            ))}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  )
}
