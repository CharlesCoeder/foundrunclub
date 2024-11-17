import { useEffect, useState } from 'react'
import { YStack, Text, Card, H2, Spinner } from 'tamagui'
import { useSupabase } from 'app/provider/supabase'
import { RewardProgress } from '../../types/rewards'
import { getRewardProgress, getTotalRunsAttended } from '../../utils/rewards/rewards'
import { RewardCard } from './RewardCard'

export function RewardsDashboard({ userId }: { userId: string }) {
  const { supabase } = useSupabase()
  const [rewards, setRewards] = useState<RewardProgress[]>([])
  const [totalRuns, setTotalRuns] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRewards() {
      try {
        if (!supabase) return
        setLoading(true)

        const runs = await getTotalRunsAttended(supabase, userId)
        setTotalRuns(runs)

        const progress = await getRewardProgress(supabase, userId)
        setRewards(progress)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load rewards')
      } finally {
        setLoading(false)
      }
    }

    if (userId) loadRewards()
  }, [userId, supabase])

  const handleClaimReward = async (rewardId: number) => {
    try {
      if (!supabase) return

      const { error } = await supabase.from('user_rewards').insert({
        user_id: userId,
        reward_id: rewardId,
        earned_at: new Date().toISOString(),
      })

      if (error) throw error

      // Refresh rewards after claiming
      const progress = await getRewardProgress(supabase, userId)
      setRewards(progress)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to claim reward')
    }
  }

  if (loading) {
    return (
      <YStack justifyContent="center" alignItems="center" p="$4">
        <Spinner size="large" color="$blue10" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack padding="$4" alignItems="center">
        <Text color="$red10">Error: {error}</Text>
      </YStack>
    )
  }

  return (
    <YStack padding="$4" space="$4">
      <YStack gap="$2">
        <H2>Rewards</H2>
        <Text color="$gray11">Total Runs Completed: {totalRuns}</Text>
      </YStack>

      {rewards.length === 0 ? (
        <Card padding="$4">
          <Text>No rewards available yet. Stay tuned!</Text>
        </Card>
      ) : (
        rewards.map((reward) => (
          <RewardCard
            key={reward.reward.id}
            reward={reward}
            totalRuns={totalRuns}
            onClaimReward={handleClaimReward}
          />
        ))
      )}
    </YStack>
  )
}
