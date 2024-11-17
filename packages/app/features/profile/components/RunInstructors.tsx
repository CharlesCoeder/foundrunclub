import { YStack, XStack, Paragraph, Spinner } from '@my/ui'
import { ProfilePicture } from 'app/components/ProfilePicture'
import { useRunInstructors } from 'app/utils/attendance/useRunInstructors'

interface RunInstructorsProps {
  runId: number
}

export function RunInstructors({ runId }: RunInstructorsProps) {
  const { instructors, isLoading, error } = useRunInstructors(runId)

  if (isLoading) {
    return (
      <YStack>
        <Paragraph size="$4" color="$color">
          Instructors
        </Paragraph>
        <YStack padding="$2" ai="center">
          <Spinner size="small" />
        </YStack>
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack>
        <Paragraph size="$4" color="$color">
          Instructors
        </Paragraph>
        <Paragraph size="$3" color="$red10">
          Failed to load instructors
        </Paragraph>
      </YStack>
    )
  }

  return (
    <YStack>
      <Paragraph size="$4" color="$color">
        Instructors
      </Paragraph>
      {!instructors.length ? (
        <Paragraph size="$3" color="$gray11">
          No instructors found for this run
        </Paragraph>
      ) : (
        <XStack flexWrap="wrap" gap="$2">
          {instructors.map((instructor) => (
            <ProfilePicture
              key={instructor.user_id}
              imageUrl={instructor.profile_image_url}
              name={`${instructor.first_name} ${instructor.last_name}`}
              size="small"
              userId={instructor.user_id}
              tooltip
              interactive
            />
          ))}
        </XStack>
      )}
    </YStack>
  )
}
