import { useSupabase } from 'app/provider/supabase'
import { RunCreate } from 'app/types/run'

export const useInsertRun = () => {
  const { supabase } = useSupabase()

  const insertRun = async (runData: RunCreate) => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      throw new Error('User is not authenticated')
    }

    // Insert the run and create instructor associations
    const { data, error } = await supabase.rpc('insert_run_and_instructors', {
      run_data: {
        date: runData.date,
        time: runData.time,
        target_pace: runData.target_pace,
        distance: runData.distance,
        route: runData.route,
        status: runData.status,
        meetup_location: runData.meetup_location,
        qr_code: runData.qr_code,
      },
      instructor_ids: runData.instructor_ids,
    })

    if (error) {
      console.error('Error inserting run:', error)
      throw error
    }

    return data
  }

  return { insertRun }
}
