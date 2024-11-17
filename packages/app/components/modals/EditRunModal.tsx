import { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  Input,
  YStack,
  Sheet,
  useToastController,
  Adapt,
  Select,
  XStack,
  ScrollView,
} from '@my/ui'
import { ChevronDown } from '@tamagui/lucide-icons'
import { DayPicker } from 'app/features/instructor/createRun/DayPicker/DayPicker'
import { InstructorSelector } from 'app/features/instructor/components/InstructorSelector'
import { useEditRun } from 'app/utils/instructors/editRun'
import { RunCreate } from 'app/types/run'

interface EditRunModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  run: RunCreate & { id: number; date: string | Date } // Add explicit date type
  onRunUpdated: () => void
}

export function EditRunModal({ open, onOpenChange, run, onRunUpdated }: EditRunModalProps) {
  // Create date from the YYYY-MM-DD string and ensure it's valid
  const [date, setDate] = useState<Date>(() => {
    try {
      // If run.date is a string like "2024-03-21"
      if (typeof run.date === 'string') {
        const [year, month, day] = run.date.split('-').map(Number)
        const newDate = new Date(year, month - 1, day)
        // Verify it's a valid date
        if (isNaN(newDate.getTime())) {
          return new Date() // Fallback to today if invalid
        }
        return newDate
      }
      // If run.date is already a Date object
      if (run.date instanceof Date) {
        return new Date(run.date)
      }
      return new Date() // Fallback to today if neither string nor Date
    } catch (error) {
      console.error('Error parsing date:', error)
      return new Date() // Fallback to today if parsing fails
    }
  })
  const [time, setTime] = useState(run.time)
  const [targetPace, setTargetPace] = useState(run.target_pace)
  const [distance, setDistance] = useState(run.distance.toString())
  const [route, setRoute] = useState(run.route || '')
  const [meetupLocation, setMeetupLocation] = useState(run.meetup_location)
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>(run.instructor_ids)

  const { editRun } = useEditRun()
  const toast = useToastController()

  // Reset form when run changes
  useEffect(() => {
    try {
      if (typeof run.date === 'string') {
        const [year, month, day] = run.date.split('-').map(Number)
        const newDate = new Date(year, month - 1, day)
        if (!isNaN(newDate.getTime())) {
          setDate(newDate)
        }
      } else if (run.date instanceof Date) {
        setDate(new Date(run.date))
      }

      setTime(run.time)
      setTargetPace(run.target_pace)
      setDistance(run.distance.toString())
      setRoute(run.route || '')
      setMeetupLocation(run.meetup_location)
      setSelectedInstructors(run.instructor_ids)
    } catch (error) {
      console.error('Error updating date:', error)
    }
  }, [run])

  const handleSubmit = async () => {
    if (!time || !targetPace || !distance || !meetupLocation || selectedInstructors.length === 0) {
      toast.show('Please fill in all required fields', { type: 'error' })
      return
    }

    try {
      // Ensure we're working with a valid date
      const submitDate = new Date(date)
      submitDate.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues

      await editRun(run.id, {
        date: submitDate,
        time,
        target_pace: targetPace,
        distance: parseFloat(distance),
        route,
        meetup_location: meetupLocation,
        instructor_ids: selectedInstructors,
      })

      toast.show('Run updated successfully', { type: 'success' })
      onRunUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update run:', error)
      toast.show('Failed to update run', { type: 'error' })
    }
  }

  // Time options (6am to midnight in 30min intervals)
  const timeOptions = Array.from({ length: 37 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6
    const minute = (i % 2) * 30
    const hour12 = hour % 12 || 12
    const ampm = hour < 12 || hour === 24 ? 'AM' : 'PM'
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      label: `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`,
    }
  })

  // Pace options (7:00 to 11:00 with 30sec intervals)
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
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" zIndex={100000} />
        <Dialog.Content
          bordered
          elevate
          key="content"
          zIndex={100001}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxHeight="90%"
          width="95%"
          maxWidth={650}
          marginHorizontal="auto"
          marginVertical="5%"
          overflow="hidden"
          scale={0.95}
          borderRadius="$4"
          padding="$0"
          backgroundColor="$background"
        >
          <Dialog.Title padding="$4" paddingBottom="$0">
            Edit Run
          </Dialog.Title>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 16,
            }}
          >
            <YStack gap="$4" paddingBottom="$4">
              <YStack paddingHorizontal="$0">
                <DayPicker
                  selected={date}
                  onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                  month={date}
                />
              </YStack>

              {/* Time Select */}
              <Select value={time} onValueChange={setTime}>
                <Select.Trigger width="100%" iconAfter={ChevronDown}>
                  <Select.Value>
                    {timeOptions.find((opt) => opt.value === time)?.label || 'Select Time'}
                  </Select.Value>
                </Select.Trigger>

                <Adapt platform="touch">
                  <Sheet {...fullSheetProps}>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay zIndex={100002} />
                  </Sheet>
                </Adapt>

                <Select.Content zIndex={100003}>
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
              <Select value={targetPace || ''} onValueChange={setTargetPace}>
                <Select.Trigger width="100%" iconAfter={ChevronDown}>
                  <Select.Value>
                    {paceOptions.find((opt) => opt.value === targetPace)?.label ||
                      'Select Target Pace'}
                  </Select.Value>
                </Select.Trigger>

                <Adapt platform="touch">
                  <Sheet {...fullSheetProps}>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay zIndex={100002} />
                  </Sheet>
                </Adapt>

                <Select.Content zIndex={100003}>
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
              />

              <Input placeholder="Route (optional)" value={route} onChangeText={setRoute} />

              {/* Location Select */}
              <Select value={meetupLocation || ''} onValueChange={setMeetupLocation}>
                <Select.Trigger width="100%" iconAfter={ChevronDown}>
                  <Select.Value>
                    {locationOptions.find((opt) => opt.value === meetupLocation)?.label ||
                      'Select Meetup Location'}
                  </Select.Value>
                </Select.Trigger>

                <Adapt platform="touch">
                  <Sheet {...smallSheetProps}>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay zIndex={100002} />
                  </Sheet>
                </Adapt>

                <Select.Content zIndex={100003}>
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

              <InstructorSelector
                currentUserId={selectedInstructors[0]}
                selectedInstructors={selectedInstructors}
                onInstructorsChange={setSelectedInstructors}
              />
            </YStack>
          </ScrollView>

          <XStack
            gap="$3"
            justifyContent="flex-end"
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <Dialog.Close asChild>
              <Button variant="outlined">Cancel</Button>
            </Dialog.Close>
            <Button
              theme="active"
              onPress={handleSubmit}
              disabled={
                !time ||
                !targetPace ||
                !distance ||
                !meetupLocation ||
                selectedInstructors.length === 0
              }
            >
              Save Changes
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
