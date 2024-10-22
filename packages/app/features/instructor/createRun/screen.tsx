import { useState } from 'react'
import { Button, Input, YStack, Text, useToastController, ScrollView } from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/utils/auth/useAuth'
import { useInsertRun } from 'app/utils/instructors/insertRun'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { RunCreate } from 'app/types/run'
import { DayPicker } from './DayPicker/DayPicker'

export function CreateRunScreen() {
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState('')
  const [targetPace, setTargetPace] = useState('')
  const [distance, setDistance] = useState('')
  const [route, setRoute] = useState('')
  const [meetupLocation, setMeetupLocation] = useState('')

  const { user, isInstructor, isAdmin } = useAuth()
  const { insertRun } = useInsertRun()
  const router = useRouter()
  const toast = useToastController()

  const handleSubmit = async () => {
    if (!isInstructor && !isAdmin) {
      toast.show('You do not have permission to create runs', { type: 'error' })
      return
    }

    if (!time || !targetPace || !distance || !meetupLocation) {
      toast.show('Please fill in all required fields', { type: 'error' })
      return
    }

    const runData: RunCreate = {
      date,
      time,
      target_pace: targetPace,
      distance: parseFloat(distance),
      route,
      status: 'scheduled', // Default status for new runs
      meetup_location: meetupLocation,
      qr_code: `run-${Date.now()}`,
    }

    try {
      await insertRun(runData)
      toast.show('Run created successfully', { type: 'success' })
      router.push('/instructor')
    } catch (error) {
      console.error('Failed to create run:', error)
      toast.show('Failed to create run', { type: 'error' })
    }
  }

  if (!user || (!isInstructor && !isAdmin)) {
    return <Text>You do not have permission to access this page.</Text>
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <YStack gap="$4" padding="$4">
          <Text fontSize="$6" fontWeight="bold">
            Create New Run
          </Text>

          {/* Replace the date Input with DayPicker */}
          <DayPicker
            selected={date}
            onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
            month={new Date()}
          />

          <Input placeholder="Time (HH:MM)" value={time} onChangeText={setTime} required />
          <Input
            placeholder="Target Pace (MM:SS)"
            value={targetPace}
            onChangeText={setTargetPace}
            required
          />
          <Input
            placeholder="Distance (km)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            required
          />
          <Input placeholder="Route (optional)" value={route} onChangeText={setRoute} />
          <Input
            placeholder="Meetup Location"
            value={meetupLocation}
            onChangeText={setMeetupLocation}
            required
          />
          <Button
            onPress={handleSubmit}
            marginVertical="$4"
            disabled={!time || !targetPace || !distance || !meetupLocation}
          >
            Create Run
          </Button>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
