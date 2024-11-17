import { Card, YStack, XStack, Text, Button, Stack } from '@my/ui'
import { Trash, Edit3, QrCode } from '@tamagui/lucide-icons'
import { InstructorRun, Run } from 'app/types/run'
import { formatDate, formatDistance, formatPace, formatTime } from 'app/utils/formatters'

interface RunCardProps {
  run: InstructorRun
  isDeleting: number | null
  onDelete: (run: Run) => void
  onEdit: (run: InstructorRun) => void
  onQrCode: (run: InstructorRun) => void
}

export function RunCard({ run, isDeleting, onDelete, onEdit, onQrCode }: RunCardProps) {
  return (
    <Card marginVertical="$2" padding={0}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        padding="$4"
        gap="$4"
        $sm={{ flexDirection: 'column', gap: '$2' }}
      >
        <YStack f={1} gap="$1" paddingRight="$2">
          <Text fontWeight="bold">
            {formatDate(new Date(run.date))} at {formatTime(run.time)}
          </Text>
          <Text>Distance: {formatDistance(run.distance)}</Text>
          {run.target_pace && <Text>Target Pace: {formatPace(run.target_pace)}</Text>}
          {run.route && <Text>Route: {run.route}</Text>}
          {run.meetup_location && <Text>Meetup: {run.meetup_location}</Text>}
        </YStack>
        <XStack
          gap="$2"
          $sm={{
            width: '100%',
            justifyContent: 'flex-end',
            paddingLeft: 0,
          }}
        >
          <Button
            icon={QrCode}
            theme="green"
            size="$3"
            onPress={() => onQrCode(run)}
            $sm={{ flex: 1, maxWidth: 100 }}
          />
          <Button
            icon={Edit3}
            theme="blue"
            size="$3"
            onPress={() => onEdit(run)}
            $sm={{ flex: 1, maxWidth: 100 }}
          />
          <Button
            icon={Trash}
            theme="red"
            size="$3"
            onPress={() => onDelete(run)}
            disabled={isDeleting === run.id}
            opacity={isDeleting === run.id ? 0.5 : 1}
            $sm={{ flex: 1, maxWidth: 100 }}
          />
        </XStack>
      </Stack>
    </Card>
  )
}
