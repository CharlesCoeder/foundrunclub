import { useEffect, useState } from 'react'
import { YStack, Text, Spinner, Button, XStack } from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useLogAttendance } from 'app/utils/attendance/logAttendance'
import { RunAttendanceDeepLink } from 'app/utils/attendance/qrCode'
import { Modal, View } from 'react-native'
import { createParam } from 'solito'

type AttendanceParams = {
  data: string
}

const { useParam } = createParam<AttendanceParams>()

export function AttendanceScreen() {
  const router = useRouter()
  const { logAttendance } = useLogAttendance()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(true)

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

        await logAttendance(parsedData)
        setStatus('success')
        setMessage('Attendance logged successfully!')

        setTimeout(() => {
          setShowModal(false)
          router.replace('/')
        }, 2000)
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
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setShowModal(false)
        router.replace('/')
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <YStack
          padding="$4"
          backgroundColor="$background"
          borderRadius="$4"
          width={300}
          alignItems="center"
          gap="$4"
        >
          {status === 'loading' && <Spinner size="large" />}
          <Text
            color={status === 'error' ? '$red10' : status === 'success' ? '$green10' : '$color'}
            textAlign="center"
          >
            {message || 'Processing attendance...'}
          </Text>
          {status === 'error' && (
            <XStack gap="$3" justifyContent="flex-end">
              <Button
                onPress={() => {
                  setShowModal(false)
                  router.replace('/')
                }}
              >
                Close
              </Button>
            </XStack>
          )}
        </YStack>
      </View>
    </Modal>
  )
}
