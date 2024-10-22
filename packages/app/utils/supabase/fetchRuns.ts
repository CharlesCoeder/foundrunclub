import { Run } from 'app/types/run'
import { useSupabase } from 'app/provider/supabase'

export const useFetchRuns = () => {
  const { supabase } = useSupabase()

  const fetchRuns = async (): Promise<Run[]> => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching runs:', error)
      throw error
    }

    return data.map((run) => ({
      ...run,
      date: new Date(run.date),
    }))
  }

  return { fetchRuns }
}
