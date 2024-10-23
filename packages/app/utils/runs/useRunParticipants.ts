import { useSupabase } from 'app/provider/supabase'
import { useState, useEffect, useCallback } from 'react'

interface Participant {
  user_id: string
  first_name: string
  last_name: string
  profile_image_url: string | null
}

interface ParticipantResponse {
  user_id: string
  users: {
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}

export const useRunParticipants = (runId: number) => {
  const { supabase } = useSupabase()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchParticipants = useCallback(async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('run_participants')
        .select(
          `
          user_id,
          users!inner (
            first_name,
            last_name,
            profile_image_url
          )
        `
        )
        .eq('run_id', runId)
        .eq('rsvp_status', 'attending')

      if (error) throw error

      const typedData = data as unknown as ParticipantResponse[]

      const formattedParticipants: Participant[] = typedData.map(({ user_id, users }) => ({
        user_id,
        first_name: users.first_name,
        last_name: users.last_name,
        profile_image_url: users.profile_image_url,
      }))

      setParticipants(formattedParticipants)
    } catch (error) {
      console.error('Error fetching participants:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, runId])

  useEffect(() => {
    if (runId) {
      fetchParticipants()
    }
  }, [runId, fetchParticipants])

  return { participants, isLoading, refreshParticipants: fetchParticipants }
}
