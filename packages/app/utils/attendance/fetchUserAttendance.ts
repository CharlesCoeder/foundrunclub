import { useSupabase } from 'app/provider/supabase'
import { Run } from 'app/types/run'

export interface AttendedRun extends Run {
  attended_at: string
}

// Type for the raw database response
interface RunAttendanceRecord {
  attended_at: string
  runs: {
    id: number
    date: string
    time: string
    distance: number
    target_pace: string | null
    route: string | null
    meetup_location: string | null
    qr_code: string
    status: 'scheduled' | 'completed'
    created_at?: string
    updated_at?: string
  }
}

export const useFetchUserAttendance = () => {
  const { supabase } = useSupabase()

  const fetchAttendedRuns = async (): Promise<AttendedRun[]> => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('run_attendance')
      .select(
        `
        attended_at,
        runs (*)
      `
      )
      .eq('user_id', user.id)
      .order('attended_at', { ascending: false })

    if (error) {
      console.error('Error fetching attended runs:', error)
      throw error
    }

    const typedData = data as unknown as RunAttendanceRecord[]

    return typedData.map((record) => ({
      ...record.runs,
      date: new Date(record.runs.date),
      attended_at: record.attended_at,
    }))
  }

  return { fetchAttendedRuns }
}
