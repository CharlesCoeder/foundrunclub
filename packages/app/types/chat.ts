export interface ChatMessage {
  id: string
  content: string
  created_at: string
  user_id: string
  user: {
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}