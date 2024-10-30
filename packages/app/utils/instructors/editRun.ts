import { useSupabase } from 'app/provider/supabase'
import { RunCreate } from 'app/types/run'

export const useEditRun = () => {
  const { supabase } = useSupabase()

  const editRun = async (runId: number, runData: Partial<RunCreate>) => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      throw new Error('User is not authenticated')
    }

    // Update the run and instructor associations
    const { data, error } = await supabase.rpc('update_run_and_instructors', {
      p_run_id: runId,
      run_data: {
        date: runData.date,
        time: runData.time,
        target_pace: runData.target_pace,
        distance: runData.distance,
        route: runData.route,
        status: runData.status,
        meetup_location: runData.meetup_location,
      },
      instructor_ids: runData.instructor_ids,
    })

    if (error) {
      console.error('Error updating run:', error)
      throw error
    }

    return data
  }

  return { editRun }
}
