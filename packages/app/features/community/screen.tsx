import { YStack, Text, Spinner } from 'tamagui'
import { useChatEligibility } from 'app/utils/community/useChatEligibility'
import { Chat } from './components/Chat'

export function CommunityScreen() {
  const { isEligible, loading: checkingEligibility } = useChatEligibility()

  if (checkingEligibility) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (!isEligible) {
    return (
      <YStack f={1} ai="center" jc="center" p="$4" space="$4">
        <Text ta="center" fow="bold" fos="$6">
          Community Chat Locked
        </Text>
        <Text ta="center" theme="alt2">
          Attend your first run to unlock the community chat feature!
        </Text>
      </YStack>
    )
  }

  return (
    <YStack f={1} minHeight="100%" height="100%">
      <Chat />
    </YStack>
  )
}
