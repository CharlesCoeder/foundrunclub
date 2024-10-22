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
