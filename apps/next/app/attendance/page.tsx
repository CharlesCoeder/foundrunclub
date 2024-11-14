'use client'

import { useRouter, useSearchParams } from 'solito/navigation'
import { AttendanceScreen } from 'app/features/attendance/screen'
import { YStack, Text, Button, Spinner } from '@my/ui'
import { QrCode } from '@tamagui/lucide-icons'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

// Separate component that uses useSearchParams
function AttendanceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const attendanceData = searchParams?.get('data')

  const handleDismiss = () => {
    router.push('/schedule')
  }

  if (!attendanceData) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        justifyContent="center"
        alignItems="center"
        padding="$4"
        space="$4"
      >
        <QrCode size={64} color="$gray8" />
        <YStack space="$2" alignItems="center">
          <Text textAlign="center" fontSize="$8" fontWeight="bold" color="$gray11">
            Scan a QR Code
          </Text>
          <Text textAlign="center" fontSize="$5" color="$gray10">
            To log your attendance, scan the QR code provided at the run location.
          </Text>
        </YStack>
        <Button marginTop="$4" onPress={() => router.push('/schedule')} theme="gray">
          View Schedule
        </Button>
      </YStack>
    )
  }

  return <AttendanceScreen onDismiss={handleDismiss} />
}

// Main page component with Suspense
export default function AttendancePage() {
  return (
    <Suspense
      fallback={
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" />
        </YStack>
      }
    >
      <AttendanceContent />
    </Suspense>
  )
}
