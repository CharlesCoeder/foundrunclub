import { Card, XStack, YStack, Text, Button, AlertDialog } from '@my/ui'
import { MapPin, Clock, Ruler } from '@tamagui/lucide-icons'
import { Run } from 'app/types/run'
import { useAuth } from 'app/utils/auth/useAuth'
import { useRSVP } from 'app/utils/runs/useRSVP'
import { useRunParticipants } from 'app/utils/runs/useRunParticipants'
import { ProfilePicture } from 'app/components/ProfilePicture'

interface RunCardProps {
  run: Run
  isSelected: boolean
  onSelect: (runId: number) => void
}

export function RunCard({ run, isSelected, onSelect }: RunCardProps) {
  const { user } = useAuth()
  const {
    participants,
    isLoading: participantsLoading,
    refreshParticipants,
  } = useRunParticipants(run.id)
  const { rsvpStatus, updateRSVP, isLoading: rsvpLoading } = useRSVP(run.id, refreshParticipants)

  const handleRSVP = async () => {
    try {
      if (rsvpStatus === 'attending') {
        await updateRSVP(null)
      } else {
        await updateRSVP('attending')
      }
    } catch (error) {
      console.error('Failed to update RSVP:', error)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'pm' : 'am'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}${minutes !== '00' ? ':' + minutes : ''}${period}`
  }

  const formatPace = (pace: string) => {
    const paceNum = parseFloat(pace)
    const minutes = Math.floor(paceNum)
    const seconds = Math.round((paceNum - minutes) * 60)

    return seconds === 0
      ? `${minutes}min/mi`
      : `${minutes}:${seconds.toString().padStart(2, '0')}min/mi`
  }

  return (
    <Card
      padding="$2"
      pressStyle={{ backgroundColor: '$backgroundHover' }}
      backgroundColor={isSelected ? '$green2' : undefined}
      onPress={() => onSelect(run.id)}
    >
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$2">
        <Text fontWeight="bold">
          {run.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
        <Text fontSize="$2" color="$blue10">
          {run.distance}mi
        </Text>
      </XStack>

      {/* Run details */}
      <YStack gap="$1">
        <XStack alignItems="center">
          <Clock size={16} />
          <Text fontSize="$2" marginLeft="$1">
            {formatTime(run.time)}
          </Text>
        </XStack>
        <XStack alignItems="center">
          <MapPin size={16} />
          <Text fontSize="$2" marginLeft="$1">
            {run.meetup_location}
          </Text>
        </XStack>
        <XStack alignItems="center">
          <Ruler size={16} />
          <Text fontSize="$2" marginLeft="$1">
            Pace: {formatPace(run.target_pace)}
          </Text>
        </XStack>
      </YStack>

      {/* Participants Section */}
      {participants.length > 0 && (
        <YStack marginTop="$2">
          <Text fontSize="$2" color="$gray11" marginBottom="$1">
            Participants ({participants.length})
          </Text>
          <XStack flexWrap="wrap" gap="$1" paddingTop="$2">
            {participants.map((participant) => (
              <ProfilePicture
                key={participant.user_id}
                imageUrl={participant.profile_image_url}
                name={`${participant.first_name} ${participant.last_name}`}
                size="small"
                userId={participant.user_id}
                tooltip
                interactive
              />
            ))}
          </XStack>
        </YStack>
      )}

      {/* RSVP Section */}
      {user && (
        <YStack marginTop="$2">
          <AlertDialog native>
            <AlertDialog.Trigger>
              <Button
                width="100%"
                theme={rsvpStatus === 'attending' ? 'gray' : 'green'}
                disabled={rsvpLoading}
              >
                {rsvpStatus === 'attending' ? 'Cancel RSVP' : 'RSVP'}
              </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
              <AlertDialog.Overlay />
              <AlertDialog.Content>
                <YStack space>
                  <AlertDialog.Title>
                    {rsvpStatus === 'attending' ? 'Cancel RSVP?' : 'Confirm RSVP'}
                  </AlertDialog.Title>
                  <AlertDialog.Description>
                    {rsvpStatus === 'attending'
                      ? `Are you sure you want to cancel your RSVP for the run on ${formatDate(
                          run.date
                        )} at ${formatTime(run.time)}?`
                      : `Would you like to RSVP for the run on ${formatDate(run.date)} at ${formatTime(
                          run.time
                        )}?`}
                  </AlertDialog.Description>

                  <XStack space="$3" justifyContent="flex-end">
                    <AlertDialog.Cancel>
                      <Button>Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action onPress={handleRSVP}>
                      <Button theme={rsvpStatus === 'attending' ? 'red' : 'green'}>
                        {rsvpStatus === 'attending' ? 'Cancel RSVP' : 'Confirm RSVP'}
                      </Button>
                    </AlertDialog.Action>
                  </XStack>
                </YStack>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog>
        </YStack>
      )}
    </Card>
  )
}
