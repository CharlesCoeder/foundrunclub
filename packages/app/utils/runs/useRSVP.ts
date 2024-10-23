import { useSupabase } from 'app/provider/supabase'
import { useState, useEffect } from 'react'

type RSVPStatus = 'attending' | null

export const useRSVP = (runId: number) => {
  const { supabase, user } = useSupabase()
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch current RSVP status when component mounts
  useEffect(() => {
    if (user && runId) {
      fetchRSVPStatus()
    }
  }, [user, runId])

  const fetchRSVPStatus = async () => {
    if (!supabase || !user) return

    const { data, error } = await supabase
      .from('run_participants')
      .select('rsvp_status')
      .eq('run_id', runId)
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setRsvpStatus(data.rsvp_status as RSVPStatus)
    }
  }

  const updateRSVP = async (status: RSVPStatus) => {
    if (!supabase || !user) return

    setIsLoading(true)
    try {
      if (status === null) {
        // Delete the RSVP
        const { error } = await supabase
          .from('run_participants')
          .delete()
          .eq('run_id', runId)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Insert or update the RSVP
        const { error } = await supabase.from('run_participants').upsert({
          run_id: runId,
          user_id: user.id,
          rsvp_status: status,
        })

        if (error) throw error
      }

      setRsvpStatus(status)
    } catch (error) {
      console.error('Error updating RSVP:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { rsvpStatus, updateRSVP, isLoading }
}
