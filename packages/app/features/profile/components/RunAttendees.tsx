import { YStack, XStack, Paragraph, Spinner } from '@my/ui'
import { ProfilePicture } from 'app/components/ProfilePicture'
import { useRunAttendees } from 'app/utils/attendance/useRunAttendees'

interface RunAttendeesProps {
  runId: number
  currentUserId: string
}

export function RunAttendees({ runId, currentUserId }: RunAttendeesProps) {
  const { attendees, isLoading, error } = useRunAttendees(runId, currentUserId)

  if (isLoading) {
    return (
      <YStack padding="$2" ai="center">
        <Spinner size="small" />
      </YStack>
    )
  }

  if (error) {
    return (
      <Paragraph size="$3" color="$red10">
        Failed to load other runners
      </Paragraph>
    )
  }

  if (!attendees.length) {
    return (
      <Paragraph size="$3" color="$gray10">
        No other runners attended this run
      </Paragraph>
    )
  }

  return (
    <YStack gap="$2">
      <Paragraph size="$4" color="$color">
        Other Runners
      </Paragraph>
      <XStack flexWrap="wrap" gap="$2">
        {attendees.map((attendee) => (
          <ProfilePicture
            key={attendee.user_id}
            imageUrl={attendee.profile_image_url}
            name={`${attendee.first_name} ${attendee.last_name}`}
            size="small"
            userId={attendee.user_id}
            tooltip
            interactive
          />
        ))}
      </XStack>
    </YStack>
  )
}
