import { Card, YStack, XStack, Text, Button } from '@my/ui'
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
    <Card key={run.id} marginVertical="$2" padding="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <YStack>
          <Text fontWeight="bold">
            {formatDate(new Date(run.date))} at {formatTime(run.time)}
          </Text>
          <Text>Distance: {formatDistance(run.distance)}</Text>
          {run.target_pace && <Text>Target Pace: {formatPace(run.target_pace)}</Text>}
          {run.route && <Text>Route: {run.route}</Text>}
          {run.meetup_location && <Text>Meetup: {run.meetup_location}</Text>}
        </YStack>
        <XStack gap="$2">
          <Button icon={QrCode} theme="green" size="$3" onPress={() => onQrCode(run)} />
          <Button icon={Edit3} theme="blue" size="$3" onPress={() => onEdit(run)} />
          <Button
            icon={Trash}
            theme="red"
            size="$3"
            onPress={() => onDelete(run)}
            disabled={isDeleting === run.id}
            opacity={isDeleting === run.id ? 0.5 : 1}
          />
        </XStack>
      </XStack>
    </Card>
  )
}
