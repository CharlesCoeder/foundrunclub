import { InstructorRun } from 'app/types/run'
import { useSupabase } from 'app/provider/supabase'
import { PostgrestError } from '@supabase/supabase-js'

export const useGetInstructorRuns = () => {
  const { supabase } = useSupabase()

  const getUpcomingInstructorRuns = async (): Promise<{
    data: InstructorRun[] | null
    error: PostgrestError | null
  }> => {
    if (!supabase) {
      console.error('Supabase client is not available')
      return {
        data: null,
        error: new Error('Supabase client is not available') as unknown as PostgrestError,
      }
    }

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('runs')
      .select(
        `
        *,
        run_instructors!inner (
          instructor_id,
          users!inner (
            id,
            first_name,
            last_name,
            profile_image_url
          )
        )
      `
      )
      .gte('date', today)
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (error) {
      console.error('Error fetching runs:', error)
      return { data: null, error }
    }

    return {
      data: data.map((run) => ({
        ...run,
        date: new Date(run.date),
      })) as InstructorRun[],
      error: null,
    }
  }

  return { getUpcomingInstructorRuns }
}
