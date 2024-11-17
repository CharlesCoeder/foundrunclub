import { useSupabase } from 'app/provider/supabase'
import { useState, useEffect, useCallback } from 'react'

interface Instructor {
  user_id: string
  first_name: string
  last_name: string
  profile_image_url: string | null
}

interface InstructorResponse {
  instructor_id: string
  users: {
    id: string
    first_name: string
    last_name: string
    profile_image_url: string | null
  }
}

export const useRunInstructors = (runId: number) => {
  const { supabase } = useSupabase()
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstructors = useCallback(async () => {
    if (!supabase || !runId) return

    try {
      setIsLoading(true)

      const { data, error: queryError } = await supabase
        .from('run_instructors')
        .select(
          `
          instructor_id,
          users!inner (
            id,
            first_name,
            last_name,
            profile_image_url
          )
        `
        )
        .eq('run_id', runId)

      if (queryError) throw queryError

      const typedData = data as unknown as InstructorResponse[]

      const formattedInstructors: Instructor[] = typedData.map(({ users }) => ({
        user_id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        profile_image_url: users.profile_image_url,
      }))

      setInstructors(formattedInstructors)
      setError(null)
    } catch (err) {
      console.error('Error fetching instructors:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch instructors')
    } finally {
      setIsLoading(false)
    }
  }, [supabase, runId])

  useEffect(() => {
    fetchInstructors()
  }, [fetchInstructors])

  return { instructors, isLoading, error, refreshInstructors: fetchInstructors }
}
