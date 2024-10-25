import { useState, useEffect } from 'react'
import {
  Button,
  Input,
  YStack,
  Text,
  useToastController,
  ScrollView,
  useMedia,
  Adapt,
  Select,
  Sheet,
} from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/utils/auth/useAuth'
import { useInsertRun } from 'app/utils/instructors/insertRun'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { RunCreate } from 'app/types/run'
import { DayPicker } from './DayPicker/DayPicker'
import { ChevronDown } from '@tamagui/lucide-icons'
import { InstructorSelector } from '../components/InstructorSelector'

export function CreateRunScreen() {
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState('')
  const [targetPace, setTargetPace] = useState('')
  const [distance, setDistance] = useState('')
  const [route, setRoute] = useState('')
  const [meetupLocation, setMeetupLocation] = useState('')
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([])

  const { user, isInstructor, isAdmin } = useAuth()
  const { insertRun } = useInsertRun()
  const router = useRouter()
  const toast = useToastController()
  const media = useMedia()

  // Generate time options from 6am to midnight in 30min intervals
  const timeOptions = Array.from({ length: 37 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6
    const minute = (i % 2) * 30
    const hour12 = hour % 12 || 12 // Convert 0 to 12 for midnight
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM'
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      label: `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`,
    }
  })

  // Generate pace options from 7:00 to 11:00 with 30sec intervals
  const paceOptions = Array.from({ length: 17 }, (_, i) => {
    const baseMinutes = 7
    const totalSeconds = baseMinutes * 60 + i * 30
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return {
      value: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      label: `${minutes}:${seconds.toString().padStart(2, '0')} min/mi`,
    }
  })

  const locationOptions = [
    { value: 'Midtown East', label: 'Midtown East' },
    { value: 'Turtle Bay', label: 'Turtle Bay' },
  ]

  useEffect(() => {
    if (user?.id && selectedInstructors.length === 0) {
      setSelectedInstructors([user.id])
    }
  }, [user?.id])

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
      instructor_ids: selectedInstructors,
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

  const fullSheetProps = {
    modal: true,
    dismissOnSnapToBottom: true,
    snapPoints: [50],
    position: 0,
  }

  const smallSheetProps = {
    modal: true,
    dismissOnSnapToBottom: true,
    snapPoints: [15],
    position: 0,
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

          {/* Date Select */}
          <DayPicker
            selected={date}
            onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
            month={new Date()}
          />

          {/* Time Select */}
          <Select value={time} onValueChange={setTime}>
            <Select.Trigger width="100%" iconAfter={ChevronDown}>
              <Select.Value placeholder="Select Time" />
            </Select.Trigger>

            <Adapt platform="touch">
              <Sheet {...fullSheetProps}>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content>
              <Select.Viewport>
                <Select.Group>
                  {timeOptions.map((option, index) => (
                    <Select.Item key={option.value} value={option.value} index={index}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select>

          {/* Pace Select */}
          <Select value={targetPace} onValueChange={setTargetPace}>
            <Select.Trigger width="100%" iconAfter={ChevronDown}>
              <Select.Value placeholder="Select Target Pace" />
            </Select.Trigger>

            <Adapt platform="touch">
              <Sheet {...fullSheetProps}>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content>
              <Select.Viewport>
                <Select.Group>
                  {paceOptions.map((option, index) => (
                    <Select.Item key={option.value} value={option.value} index={index}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select>

          <Input
            placeholder="Distance (mi)"
            value={distance}
            onChangeText={setDistance}
            keyboardType="numeric"
            required
          />
          <Input placeholder="Route (optional)" value={route} onChangeText={setRoute} />
          {/* Location Select */}
          <Select value={meetupLocation} onValueChange={setMeetupLocation}>
            <Select.Trigger width="100%" iconAfter={ChevronDown}>
              <Select.Value placeholder="Select Meetup Location" />
            </Select.Trigger>

            <Adapt platform="touch">
              <Sheet {...smallSheetProps}>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>
                <Sheet.Overlay />
              </Sheet>
            </Adapt>

            <Select.Content>
              <Select.Viewport>
                <Select.Group>
                  {locationOptions.map((option, index) => (
                    <Select.Item key={option.value} value={option.value} index={index}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
          </Select>
          {/* Instructor Select */}
          {user && (
            <InstructorSelector
              currentUserId={user.id}
              selectedInstructors={selectedInstructors}
              onInstructorsChange={setSelectedInstructors}
            />
          )}
          <Button
            onPress={handleSubmit}
            marginVertical="$4"
            disabled={
              !time ||
              !targetPace ||
              !distance ||
              !meetupLocation ||
              selectedInstructors.length === 0
            }
          >
            Create Run
          </Button>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
