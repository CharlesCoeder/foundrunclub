import { YStack, XStack, Text, Card, H3, Paragraph, Progress, Theme, Button } from 'tamagui'
import { SolitoImage } from 'solito/image'
import { RewardProgress } from '../../types/rewards'

export function RewardCard({
  reward,
  totalRuns,
  onClaimReward,
}: {
  reward: RewardProgress
  totalRuns: number
  onClaimReward: (rewardId: number) => Promise<void>
}) {
  const progressPercent = reward.earned ? 100 : (totalRuns / reward.reward.required_runs) * 100
  const clampedProgress = Math.min(progressPercent, 100)

  const isClaimable = totalRuns >= reward.reward.required_runs && !reward.earned

  return (
    <Card
      elevate
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      width="100%"
      marginVertical="$2"
    >
      <Card.Header padded>
        <XStack space="$4" alignItems="center" flexWrap="wrap">
          {reward.reward.image_url && (
            <SolitoImage
              src={reward.reward.image_url}
              width={60}
              height={60}
              alt={`${reward.reward.name} reward image`}
              style={{
                width: 60,
                height: 60,
                borderRadius: 4,
                objectFit: 'cover',
                backgroundColor: '#f0f0f0',
                borderWidth: 1,
                borderColor: '#e0e0e0',
              }}
              //@ts-ignore
              contentFit="cover"
              contentPosition="center"
            />
          )}

          <YStack flex={1} minWidth={150}>
            <XStack justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <H3>{reward.reward.name}</H3>
              <Text fontSize="$3" color="$gray11" marginLeft="$2">
                {reward.earned ? (
                  <Theme name="green">
                    <Text fontSize="$4" fontWeight="bold">
                      Earned! 🎉
                    </Text>
                  </Theme>
                ) : (
                  `${reward.reward.required_runs - totalRuns} run${reward.reward.required_runs - totalRuns === 1 ? '' : 's'} to go`
                )}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Card.Header>

      <Card.Footer padded>
        <YStack space="$2" width="100%">
          <Paragraph>{reward.reward.description}</Paragraph>

          <YStack space="$1">
            <Progress value={clampedProgress} backgroundColor="$gray5">
              <Progress.Indicator
                animation="bouncy"
                backgroundColor={reward.earned ? '$green9' : '$blue9'}
              />
            </Progress>

            <XStack justifyContent="space-between">
              {reward.earned ? (
                <Text color="$gray11" size="$2">
                  Reward Earned!
                </Text>
              ) : (
                <Text color="$gray11" size="$2">
                  {`${totalRuns} run${totalRuns === 1 ? '' : 's'} completed`}
                </Text>
              )}
              {!reward.earned && (
                <Text color="$gray11" size="$2">
                  {`Goal: ${reward.reward.required_runs} run${reward.reward.required_runs === 1 ? '' : 's'}`}
                </Text>
              )}
            </XStack>
          </YStack>

          {isClaimable && (
            <Button theme="blue" onPress={() => onClaimReward(reward.reward.id)} marginTop="$2">
              Claim Reward! 🎉
            </Button>
          )}

          {reward.earned && reward.earnedAt && (
            <Text color="$gray11" size="$2">
              Earned on {new Date(reward.earnedAt).toLocaleDateString()}
            </Text>
          )}
        </YStack>
      </Card.Footer>
    </Card>
  )
}
