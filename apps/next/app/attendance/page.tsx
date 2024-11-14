'use client'

import { AttendanceScreen } from 'app/features/attendance/screen'
import { useRouter } from 'solito/navigation'
import { Suspense } from 'react'

export default function AttendancePage() {
  const router = useRouter()

  const handleDismiss = () => {
    router.push('/schedule')
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttendanceScreen onDismiss={handleDismiss} />
    </Suspense>
  )
}
