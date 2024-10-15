import { useSupabase } from 'app/provider/supabase'

interface RunData {
  date: string
  time: string
  target_pace: string
  distance: number
  route?: string
  meetup_location?: string
  max_participants?: number
  qr_code: string
}

export const useInsertRun = () => {
  const { supabase } = useSupabase()

  const insertRun = async (runData: RunData) => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      throw new Error('User is not authenticated')
    }

    // Call the Supabase function to insert run and instructor
    const { data, error } = await supabase.rpc('insert_run_and_instructor', {
      run_data: runData,
      instructor_id: user.data.user.id,
    })

    if (error) {
      console.error('Error inserting run:', error)
      throw error
    }

    return data
  }

  return { insertRun }
}
