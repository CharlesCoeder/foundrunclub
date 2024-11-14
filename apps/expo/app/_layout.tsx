import { useEffect, useState } from 'react'
import { useColorScheme, Linking } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from 'app/provider'
import { NativeToast } from '@my/ui/src/NativeToast'
import { useSupabase } from 'app/provider/supabase'
import { Session } from '@supabase/supabase-js'
import { useAuth } from 'app/utils/auth/useAuth'

// Add this export for Expo Router linking configuration
export const scheme = 'foundrunclub'

export const unstable_settings = {
  initialRouteName: 'index',
}

// Debug deep links in development
if (__DEV__) {
  Linking.addEventListener('url', (event) => {
    console.log('Deep link received:', event.url)
  })
}

export default function App() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const { supabase } = useSupabase()
  const [session, setSession] = useState<Session | null>(null)
  const { isInstructor, isAdmin } = useAuth()

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {session ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
          <Stack.Screen
            name="attendance/index"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack>
        <NativeToast />
      </ThemeProvider>
    </Provider>
  )
}
