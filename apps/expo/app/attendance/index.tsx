import { Modal } from 'react-native'
import { AttendanceScreen } from 'app/features/attendance/screen'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export default function AttendancePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    router.back()
  }

  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="slide"
      onRequestClose={handleDismiss}
      statusBarTranslucent
      presentationStyle="formSheet"
    >
      <AttendanceScreen onDismiss={handleDismiss} />
    </Modal>
  )
}
