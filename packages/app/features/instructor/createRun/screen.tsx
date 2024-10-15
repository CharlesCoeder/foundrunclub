import { useState } from 'react'
import { Button, Input, YStack, Text, useToastController, ScrollView } from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/utils/auth/useAuth'
import { useInsertRun } from 'app/utils/instructors/insertRun'
import { KeyboardAvoidingView, Platform } from 'react-native'

export function CreateRunScreen() {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [targetPace, setTargetPace] = useState('')
  const [distance, setDistance] = useState('')
  const [route, setRoute] = useState('')
  const [meetupLocation, setMeetupLocation] = useState('')
  const [maxParticipants, setMaxParticipants] = useState('')

  const { user, isInstructor, isAdmin } = useAuth()
  const { insertRun } = useInsertRun()
  const router = useRouter()
  const toast = useToastController()

  const handleSubmit = async () => {
    if (!isInstructor && !isAdmin) {
      toast.show('You do not have permission to create runs', { type: 'error' })
      return
    }

    const runData = {
      date,
      time,
      target_pace: targetPace,
      distance: parseFloat(distance),
      route,
      meetup_location: meetupLocation,
      max_participants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
      qr_code: `run-${Date.now()}`, // Generate a unique QR code
    }

    try {
      const newRun = await insertRun(runData)

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
          <Input placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
          <Input placeholder="Time (HH:MM)" value={time} onChangeText={setTime} />
          <Input
            placeholder="Target Pace (MM:SS)"
            value={targetPace}
            onChangeText={setTargetPace}
          />
          <Input
            placeholder="Distance (km)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
          />
          <Input placeholder="Route" value={route} onChangeText={setRoute} />
          <Input
            placeholder="Meetup Location"
            value={meetupLocation}
            onChangeText={setMeetupLocation}
          />
          <Input
            placeholder="Max Participants"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="numeric"
          />
          <Button onPress={handleSubmit} marginVertical="$4">
            Create Run
          </Button>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
