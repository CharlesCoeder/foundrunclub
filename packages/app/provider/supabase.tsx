import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient, SupabaseClient, User } from '@supabase/supabase-js'
import Constants from 'expo-constants'

type SupabaseContextType = {
  supabase: SupabaseClient | null
  user: User | null
}

const SupabaseContext = createContext<SupabaseContextType>({ supabase: null, user: null })

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
    const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL and Anon Key must be provided')
      return
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    setSupabase(supabaseClient)

    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase, user }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)