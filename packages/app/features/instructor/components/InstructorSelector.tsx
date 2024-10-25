import { useState, useEffect } from 'react'
import { XStack, YStack, Text, Checkbox, Spinner } from '@my/ui'
import { useFetchInstructors, Instructor } from 'app/utils/instructors/fetchInstructors'
import { ProfilePicture } from 'app/components/ProfilePicture'

interface InstructorSelectorProps {
  currentUserId: string
  selectedInstructors: string[]
  onInstructorsChange: (instructorIds: string[]) => void
}

export function InstructorSelector({
  currentUserId,
  selectedInstructors,
  onInstructorsChange,
}: InstructorSelectorProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const { fetchInstructors } = useFetchInstructors()

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        const data = await fetchInstructors()
        setInstructors(data)
      } catch (error) {
        console.error('Failed to load instructors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInstructors()
  }, [])

  const handleToggleInstructor = (instructorId: string) => {
    const newSelection = selectedInstructors.includes(instructorId)
      ? selectedInstructors.filter((id) => id !== instructorId)
      : [...selectedInstructors, instructorId]
    onInstructorsChange(newSelection)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <YStack gap="$2">
      <Text fontSize="$5" fontWeight="bold">
        Run Leaders ({instructors.length})
      </Text>
      {instructors.length === 0 && <Text color="$gray10">No instructors found</Text>}
      {instructors.map((instructor) => (
        <XStack
          key={instructor.id}
          alignItems="center"
          space="$2"
          backgroundColor="$gray3"
          padding="$2"
          borderRadius="$2"
          cursor="pointer"
          hoverStyle={{
            backgroundColor: '$gray4',
            opacity: 0.9,
          }}
          pressStyle={{
            opacity: 0.8,
          }}
          onPress={() => handleToggleInstructor(instructor.id)}
        >
          <Checkbox
            checked={selectedInstructors.includes(instructor.id)}
            onCheckedChange={() => handleToggleInstructor(instructor.id)}
            disabled={instructor.id === currentUserId}
          >
            <Checkbox.Indicator>
              <Text>✓</Text>
            </Checkbox.Indicator>
          </Checkbox>

          <ProfilePicture
            imageUrl={instructor.profile_image_url}
            name={`${instructor.first_name} ${instructor.last_name}`}
            size="small"
            userId={instructor.id}
          />

          <Text>
            {instructor.first_name} {instructor.last_name}
            {instructor.id === currentUserId && ' (You)'}
          </Text>
        </XStack>
      ))}
    </YStack>
  )
}
