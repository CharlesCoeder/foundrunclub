import { useSupabase } from 'app/provider/supabase'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

interface UserRole {
  role_id: number
}

export const useAuth = () => {
  const { supabase, user } = useSupabase()
  const [isInstructor, setIsInstructor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      checkUserRole(user)
    } else {
      setIsInstructor(false)
      setIsAdmin(false)
    }
  }, [user])

  const checkUserRole = async (currentUser: User) => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', currentUser.id)

    if (error) {
      setIsInstructor(false)
      setIsAdmin(false)
    } else if (data && data.length > 0) {
      const userRole = data[0] as UserRole
      setIsInstructor(userRole.role_id === 2)
      setIsAdmin(userRole.role_id === 3)
    } else {
      setIsInstructor(false)
      setIsAdmin(false)
    }
  }

  return { user, isInstructor, isAdmin }
}
