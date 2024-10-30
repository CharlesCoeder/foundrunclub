export interface Reward {
  id: number
  name: string
  description: string
  required_runs: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface UserReward {
  user_id: string
  reward_id: number
  earned_at: string
  reward?: Reward // For joined queries
}

export type RewardProgress = {
  reward: Reward
  progress: number
  earned: boolean
  earnedAt?: string
}
