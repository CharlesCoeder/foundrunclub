import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

type SupabaseContextType = {
  supabase: SupabaseClient | null
}

const SupabaseContext = createContext<SupabaseContextType>({ supabase: null })

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
    const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL and Anon Key must be provided')
      return
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    setSupabase(supabaseClient)
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => useContext(SupabaseContext)