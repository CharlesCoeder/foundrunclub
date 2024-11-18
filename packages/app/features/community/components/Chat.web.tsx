import { YStack, Text, H3 } from '@my/ui'

export function Chat() {
  return (
    <YStack f={1} ai="center" jc="center" gap="$4" p="$4">
      <H3>Chat Coming Soon</H3>
      <Text ta="center" theme="alt2">
        The web version of the chat feature is currently under development.
      </Text>
    </YStack>
  )
}
