import { useSupabase } from 'app/provider/supabase'

export interface Instructor {
  id: string
  first_name: string
  last_name: string
  profile_image_url: string | null
}

export const useFetchInstructors = () => {
  const { supabase } = useSupabase()

  const fetchInstructors = async (): Promise<Instructor[]> => {
    if (!supabase) {
      throw new Error('Supabase client is not available')
    }

    const { data, error } = await supabase
      .from('users')
      .select(
        `
        id,
        first_name,
        last_name,
        profile_image_url,
        user_roles!inner(role_id)
      `
      )
      .eq('user_roles.role_id', 2) // 2 is the instructor role ID
      .order('first_name', { ascending: true })

    if (error) {
      console.error('Error fetching instructors:', error)
      throw error
    }

    // Clean up the response to match our Instructor interface
    const instructors: Instructor[] = data.map(
      ({ id, first_name, last_name, profile_image_url }) => ({
        id,
        first_name,
        last_name,
        profile_image_url,
      })
    )

    return instructors
  }

  return { fetchInstructors }
}
