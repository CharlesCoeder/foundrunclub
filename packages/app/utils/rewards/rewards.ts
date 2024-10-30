import { UserReward, RewardProgress } from '../../types/rewards'
import { SupabaseClient } from '@supabase/supabase-js'

export async function getUserRewards(
  supabase: SupabaseClient,
  userId: string
): Promise<UserReward[]> {
  const { data, error } = await supabase
    .from('user_rewards')
    .select('*, reward:rewards(*)')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export async function getTotalRunsAttended(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data, error } = await supabase
    .from('run_attendance')
    .select('count', { count: 'exact' })
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data?.count || 0
}

export async function checkAndAwardRewards(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  // Get user's total runs from attendance
  const totalRuns = await getTotalRunsAttended(supabase, userId)

  // Get all rewards
  const { data: rewards, error: rewardsError } = await supabase
    .from('rewards')
    .select('*')
    .order('required_runs', { ascending: true })

  if (rewardsError) throw rewardsError

  // Get user's existing rewards
  const { data: existingRewards, error: existingError } = await supabase
    .from('user_rewards')
    .select('reward_id')
    .eq('user_id', userId)

  if (existingError) throw existingError

  const earnedRewardIds = new Set(existingRewards.map((r) => r.reward_id))

  // Check for new rewards to award
  const newRewards = rewards.filter(
    (reward) => reward.required_runs <= totalRuns && !earnedRewardIds.has(reward.id)
  )

  // Award new rewards
  for (const reward of newRewards) {
    const { error } = await supabase.from('user_rewards').insert({
      user_id: userId,
      reward_id: reward.id,
    })

    if (error) throw error
  }

  // Update the user's total_runs_attended for caching purposes
  const { error: updateError } = await supabase
    .from('users')
    .update({ total_runs_attended: totalRuns })
    .eq('id', userId)

  if (updateError) throw updateError
}

export async function getRewardProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<RewardProgress[]> {
  const totalRuns = await getTotalRunsAttended(supabase, userId)

  // Get all rewards and user's earned rewards
  const { data: rewards, error: rewardsError } = await supabase
    .from('rewards')
    .select('*')
    .order('required_runs', { ascending: true })

  if (rewardsError) throw rewardsError

  const { data: userRewards, error: userRewardsError } = await supabase
    .from('user_rewards')
    .select('*')
    .eq('user_id', userId)

  if (userRewardsError) throw userRewardsError

  const earnedRewards = new Map(userRewards.map((ur) => [ur.reward_id, ur.earned_at]))

  return rewards.map((reward) => ({
    reward,
    progress: Math.min(totalRuns / reward.required_runs, 1),
    earned: earnedRewards.has(reward.id),
    earnedAt: earnedRewards.get(reward.id),
  }))
}
