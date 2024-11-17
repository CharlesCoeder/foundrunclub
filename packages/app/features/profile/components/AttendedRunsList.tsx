import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { H2, Paragraph, YStack, XStack, Spinner, Accordion } from '@my/ui'
import { ChevronDown } from '@tamagui/lucide-icons'
import { useFetchUserAttendance, AttendedRun } from 'app/utils/attendance/fetchUserAttendance'
import { formatDistance, formatDateAbbrev, formatTime, formatPace } from 'app/utils/formatters'
import { RunAttendees } from './RunAttendees'
import { RunInstructors } from './RunInstructors'

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
    <YStack
      padding="$4"
      gap="$4"
      maxWidth={800}
      width="100%"
      alignSelf="center"
      $sm={{ padding: '$3' }}
    >
      <H2>Run History ({runs.length})</H2>
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
                    paddingHorizontal="$5"
                    paddingVertical="$4"
                    hoverStyle={{ backgroundColor: '$backgroundHover' }}
                    pressStyle={{ backgroundColor: '$backgroundPress' }}
                    $sm={{
                      paddingHorizontal: '$4',
                      paddingVertical: '$3',
                    }}
                  >
                    {({ open }) => (
                      <XStack width="100%" justifyContent="space-between" alignItems="center">
                        <Paragraph size="$6" fontWeight="600" $sm={{ size: '$5' }}>
                          {formatDateAbbrev(run.date)}
                        </Paragraph>
                        <XStack gap="$3" alignItems="center">
                          <Paragraph size="$5" color="$color" $sm={{ size: '$4' }}>
                            {formatDistance(run.distance)}
                          </Paragraph>
                          <ChevronDown
                            size={16}
                            color="$color"
                            rotate={open ? '180deg' : '0deg'}
                            animation="quick"
                          />
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
                    paddingHorizontal="$5"
                    paddingVertical="$4"
                    $sm={{
                      paddingHorizontal: '$4',
                      paddingVertical: '$3',
                    }}
                  >
                    <YStack gap="$5" $sm={{ gap: '$4' }}>
                      {/* Run Details Grid - 2x2 */}
                      <XStack
                        gap="$6"
                        flexWrap="wrap"
                        $sm={{
                          gap: '$4',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Left Column */}
                        <YStack
                          gap="$4"
                          flex={1}
                          minWidth={250}
                          $sm={{
                            minWidth: 'auto',
                            gap: '$3',
                          }}
                        >
                          <YStack gap="$1">
                            <Paragraph size="$3" color="$gray11" $sm={{ size: '$2' }}>
                              Start Time
                            </Paragraph>
                            <Paragraph size="$4" fontWeight="500" $sm={{ size: '$3' }}>
                              {formatTime(run.time)}
                            </Paragraph>
                          </YStack>

                          {run.target_pace && (
                            <YStack gap="$1">
                              <Paragraph size="$3" color="$gray11" $sm={{ size: '$2' }}>
                                Target Pace
                              </Paragraph>
                              <Paragraph size="$4" fontWeight="500" $sm={{ size: '$3' }}>
                                {formatPace(run.target_pace)}
                              </Paragraph>
                            </YStack>
                          )}
                        </YStack>

                        {/* Right Column */}
                        <YStack
                          gap="$4"
                          flex={1}
                          minWidth={250}
                          $sm={{
                            minWidth: 'auto',
                            gap: '$3',
                          }}
                        >
                          {run.meetup_location && (
                            <YStack gap="$1">
                              <Paragraph size="$3" color="$gray11" $sm={{ size: '$2' }}>
                                Location
                              </Paragraph>
                              <Paragraph size="$4" fontWeight="500" $sm={{ size: '$3' }}>
                                {run.meetup_location}
                              </Paragraph>
                            </YStack>
                          )}

                          {run.route && (
                            <YStack gap="$1">
                              <Paragraph size="$3" color="$gray11" $sm={{ size: '$2' }}>
                                Route
                              </Paragraph>
                              <Paragraph size="$4" fontWeight="500" $sm={{ size: '$3' }}>
                                {run.route}
                              </Paragraph>
                            </YStack>
                          )}
                        </YStack>
                      </XStack>

                      {/* Participants Section */}
                      <YStack
                        borderTopWidth={1}
                        borderColor="$borderColor"
                        paddingTop="$4"
                        gap="$4"
                        $sm={{
                          paddingTop: '$3',
                          gap: '$3',
                        }}
                      >
                        <RunInstructors runId={run.id} />
                      </YStack>

                      {/* Instructors Section */}
                      <YStack
                        borderTopWidth={1}
                        borderColor="$borderColor"
                        paddingTop="$4"
                        $sm={{
                          paddingTop: '$3',
                        }}
                      >
                        <RunAttendees runId={run.id} currentUserId={userId} />
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
