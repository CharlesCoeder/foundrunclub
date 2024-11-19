import { XStack, Input, Button, Text } from 'tamagui'

interface ChatInputProps {
  value: string
  onChange: (text: string) => void
  onSend: () => void
  sending: boolean
}

export function ChatInput({ value, onChange, onSend, sending }: ChatInputProps) {
  return (
    <XStack
      p="$4"
      gap="$2"
      bw={1}
      btc="$borderColor"
      backgroundColor="$background"
      borderBottomWidth={0}
      borderRightWidth={0}
      borderLeftWidth={0}
    >
      <Input
        f={1}
        value={value}
        onChangeText={onChange}
        placeholder="Type a message..."
        disabled={sending}
      />
      <Button
        onPress={onSend}
        disabled={sending || !value.trim()}
        theme={sending ? 'alt2' : undefined}
      >
        <Text>Send</Text>
      </Button>
    </XStack>
  )
}
