import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'

type SupabaseContextType = {
  supabase: SupabaseClient | null
  user: User | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const createSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

export const SupabaseProvider: React.FC<{ children: React.ReactNode; initialSession?: { user: User | null } | null }> = ({ children, initialSession = null }) => {
  const [supabase] = useState(() => createSupabaseClient())
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  return (
    <SupabaseContext.Provider value={{ supabase, user }}>
      {children}
    </SupabaseContext.Provider>
  )
}