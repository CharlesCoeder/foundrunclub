import { useSupabase } from 'app/provider/supabase'
import { useState, useEffect, useCallback } from 'react'

interface Attendee {
  user_id: string
  first_name: string
  last_name: string
  profile_image_url: string | null
  attended_at: string
}

type AttendeeResponse = {
  user_id: string
  attended_at: string
  users: {
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}

export const useRunAttendees = (runId: number, excludeUserId?: string) => {
  const { supabase } = useSupabase()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendees = useCallback(async () => {
    if (!supabase || !runId) return

    try {
      setIsLoading(true)

      // First, get the instructor IDs for this run
      const { data: instructorData } = await supabase
        .from('run_instructors')
        .select('instructor_id')
        .eq('run_id', runId)

      const instructorIds = instructorData?.map(i => i.instructor_id) || []

      // Then get attendees excluding instructors
      let query = supabase
        .from('run_attendance')
        .select(`
          user_id,
          attended_at,
          users!inner (
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .eq('run_id', runId)

      // Only apply the instructor filter if there are instructors
      if (instructorIds.length > 0) {
        // Using array syntax for the filter
        query = query.filter('user_id', 'not.in', `(${instructorIds.join(',')})`)
      }

      // Also exclude the current user if an ID was provided
      if (excludeUserId) {
        query = query.neq('user_id', excludeUserId)
      }

      const { data, error: queryError } = await query
        .order('attended_at', { ascending: false })

      if (queryError) throw queryError

      const typedData = data as unknown as AttendeeResponse[]

      const formattedAttendees: Attendee[] = typedData.map(({ user_id, attended_at, users }) => ({
        user_id,
        attended_at,
        first_name: users.first_name,
        last_name: users.last_name,
        profile_image_url: users.profile_image_url,
      }))

      setAttendees(formattedAttendees)
      setError(null)
    } catch (err) {
      console.error('Error fetching attendees:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch attendees')
    } finally {
      setIsLoading(false)
    }
  }, [supabase, runId, excludeUserId])

  useEffect(() => {
    fetchAttendees()
  }, [fetchAttendees])

  return { attendees, isLoading, error, refreshAttendees: fetchAttendees }
}
