import { useSupabase } from 'app/provider/supabase'
import { PostgrestError } from '@supabase/supabase-js'

export interface Run {
  id: string
  date: string
  time: string
  target_pace: string
  distance: number
  route?: string
  meetup_location?: string
  max_participants?: number
  qr_code: string
}

export const useGetRuns = () => {
  const { supabase } = useSupabase()

  const getUpcomingRuns = async (): Promise<{
    data: Run[] | null
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
        run_instructors!inner(instructor_id)
      `
      )
      .gte('date', today)
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (error) {
      console.error('Error fetching runs:', error)
    }

    return { data: data as Run[] | null, error }
  }

  return { getUpcomingRuns }
}
