import { useEffect, useState } from 'react'
import { YStack, Text, Spinner, Button, XStack, Circle } from '@my/ui'
import { useLogAttendance } from 'app/utils/attendance/logAttendance'
import { RunAttendanceDeepLink } from 'app/utils/attendance/qrCode'
import { createParam } from 'solito'
import { Check, X } from '@tamagui/lucide-icons'
import { formatDistance, formatPace, formatTime, formatDate } from 'app/utils/formatters'
import { Run } from 'app/types/run'

type AttendanceParams = {
  data: string
}

const { useParam } = createParam<AttendanceParams>()

interface AttendanceScreenProps {
  onDismiss: () => void
}

export function AttendanceScreen({ onDismiss }: AttendanceScreenProps) {
  const { logAttendance, getRunDetails } = useLogAttendance()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [runDetails, setRunDetails] = useState<Run | null>(null)

  // Get the raw encoded data from the URL
  const [rawData] = useParam('data')

  // Parse the data in a separate effect
  const [parsedData, setParsedData] = useState<RunAttendanceDeepLink | null>(null)

  useEffect(() => {
    if (!rawData) return

    try {
      const decoded = decodeURIComponent(rawData)
      const parsed = JSON.parse(decoded) as RunAttendanceDeepLink
      setParsedData(parsed)
    } catch (e) {
      console.error('Failed to parse attendance data:', e)
      setStatus('error')
      setMessage('Invalid attendance data')
    }
  }, [rawData])

  useEffect(() => {
    const handleAttendance = async () => {
      try {
        if (!parsedData) {
          throw new Error('No attendance data provided')
        }

        // First get run details
        const details = await getRunDetails(parsedData.runId)
        setRunDetails(details)

        // Then log attendance
        await logAttendance(parsedData)
        setStatus('success')
        setMessage('Attendance logged successfully!')
      } catch (error) {
        console.error('Attendance error:', error)
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Failed to log attendance')
      }
    }

    if (parsedData) {
      handleAttendance()
    }
  }, [parsedData])

  return (
    <YStack flex={1} backgroundColor="$background" justifyContent="center" padding="$4">
      <YStack
        backgroundColor="$background"
        borderRadius="$6"
        padding="$6"
        gap="$4"
        alignItems="center"
        shadowColor="$gray8"
        shadowRadius={20}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.25}
      >
        {status === 'loading' ? (
          <YStack alignItems="center" gap="$4">
            <Spinner size="large" />
            <Text fontSize="$6" fontWeight="bold">
              Logging Attendance...
            </Text>
          </YStack>
        ) : (
          <>
            <Circle
              backgroundColor={status === 'success' ? '$green5' : '$red5'}
              padding="$4"
              marginVertical="$4"
            >
              {status === 'success' ? (
                <Check size={32} color="$green10" />
              ) : (
                <X size={32} color="$red10" />
              )}
            </Circle>

            <Text
              color={status === 'success' ? '$green10' : '$red10'}
              textAlign="center"
              fontSize="$8"
              fontWeight="bold"
              marginBottom="$4"
            >
              {status === 'success' ? 'Attendance logged successfully!' : message}
            </Text>

            {runDetails && status === 'success' && (
              <YStack gap="$4" width="100%">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray11" fontSize="$5">
                    Date:
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {formatDate(new Date(runDetails.date))}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray11" fontSize="$5">
                    Time:
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {formatTime(runDetails.time)}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray11" fontSize="$5">
                    Distance:
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {formatDistance(runDetails.distance)}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray11" fontSize="$5">
                    Target Pace:
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {formatPace(runDetails.target_pace)}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray11" fontSize="$5">
                    Location:
                  </Text>
                  <Text fontWeight="bold" fontSize="$5">
                    {runDetails.meetup_location}
                  </Text>
                </XStack>
              </YStack>
            )}

            <Button
              marginTop="$6"
              width="100%"
              theme={status === 'success' ? 'green' : 'red'}
              onPress={onDismiss}
            >
              {status === 'success' ? 'Done' : 'Close'}
            </Button>
          </>
        )}
      </YStack>
    </YStack>
  )
}
