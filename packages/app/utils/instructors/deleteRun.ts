import { useSupabase } from 'app/provider/supabase'
import { useAuth } from 'app/utils/auth/useAuth'

export const useDeleteRun = () => {
  const { supabase } = useSupabase()
  const { isInstructor, isAdmin, user } = useAuth()

  const deleteRun = async (runId: number) => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    if (!user) {
      throw new Error('User is not authenticated')
    }

    if (!isInstructor && !isAdmin) {
      throw new Error('Not authorized to delete runs')
    }

    if (isInstructor && !isAdmin) {
      const { data: instructorRun, error: verifyError } = await supabase
        .from('run_instructors')
        .select('*')
        .eq('run_id', runId)
        .eq('instructor_id', user.id)
        .single()

      if (verifyError || !instructorRun) {
        throw new Error('Not authorized to delete this run - instructor not assigned')
      }
    }

    const { error: deleteError } = await supabase.from('runs').delete().eq('id', runId)

    if (deleteError) {
      throw deleteError
    }
  }

  return { deleteRun }
}
