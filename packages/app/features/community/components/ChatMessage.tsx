import { XStack, YStack, Text } from 'tamagui'
import { ProfilePicture } from 'app/components/ProfilePicture'
import { ChatMessage } from 'app/types/chat'
import { format } from 'date-fns'

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessageItem({ message }: ChatMessageProps) {
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, h:mm a')
  }

  return (
    <XStack gap="$2" ai="flex-start">
      <ProfilePicture
        imageUrl={message.user.profile_image_url}
        name={`${message.user.first_name} ${message.user.last_name}`}
        size="small"
        userId={message.user_id}
        tooltip
        interactive
      />

      <YStack f={1} gap="$1">
        <XStack gap="$2" ai="center">
          <Text fow="bold">
            {message.user.first_name} {message.user.last_name}
          </Text>
          <Text fos="$2" theme="alt2">
            {formatMessageTime(message.created_at)}
          </Text>
        </XStack>
        <Text>{message.content}</Text>
      </YStack>
    </XStack>
  )
}
