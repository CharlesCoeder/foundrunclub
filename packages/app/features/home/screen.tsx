import {
  Button,
  H1,
  Paragraph,
  Separator,
  useToastController,
  SwitchThemeButton,
  XStack,
  YStack,
} from '@my/ui'
import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { useRouter } from 'solito/navigation'
import { useSupabase } from '../../provider/supabase'
import { useAuth } from 'app/utils/auth/useAuth'

export function HomeScreen() {
  const router = useRouter()
  const { supabase, user } = useSupabase()
  const { isInstructor, isAdmin } = useAuth()
  const [userInfo, setUserInfo] = useState<any>(null)
  const toast = useToastController()

  useEffect(() => {
    if (user) {
      fetchUserInfo()
    } else {
      setUserInfo(null)
    }
  }, [user])

  const fetchUserInfo = async () => {
    if (!supabase || !user) return

    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()

    if (error) {
      console.error('Error fetching user info:', error)
    } else {
      setUserInfo(data)
    }
  }

  const handleLogout = async () => {
    if (!supabase) return

    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.show('Error logging out', {
        type: 'error',
      })
    } else {
      setUserInfo(null)
      toast.show('Logged out successfully', {
        type: 'success',
      })
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const navigateToProfile = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  const navigateToSchedule = () => {
    router.push('/schedule')
  }

  const navigateToInstructorRuns = () => {
    router.push('/instructor')
  }

  return (
    <YStack f={1} jc="center" ai="center" gap="$8" p="$4" bg="$background">
      <XStack
        pos="absolute"
        w="100%"
        t="$6"
        gap="$6"
        jc="center"
        fw="wrap"
        $sm={{ pos: 'relative', t: 0 }}
      >
        {Platform.OS === 'web' && <SwitchThemeButton />}
      </XStack>

      <YStack gap="$4">
        <H1 ta="center" col="$color12">
          Welcome to Run Club
        </H1>
        {userInfo ? (
          <YStack gap="$2">
            <Paragraph ta="center">Logged in as: {userInfo.email}</Paragraph>
            <Paragraph ta="center">
              Name: {userInfo.first_name} {userInfo.last_name}
            </Paragraph>
          </YStack>
        ) : (
          <Paragraph ta="center">Please log in to see your information</Paragraph>
        )}
        <Separator />
      </YStack>

      {user ? (
        <Button onPress={handleLogout}>Log Out</Button>
      ) : (
        <Button onPress={handleLogin}>Log In</Button>
      )}

      {userInfo && <Button onPress={() => navigateToProfile(userInfo.id)}>View My Profile</Button>}

      <Button onPress={navigateToSchedule}>View Schedule</Button>

      {user && (isInstructor || isAdmin) && (
        <Button onPress={navigateToInstructorRuns}>Instructor</Button>
      )}
    </YStack>
  )
}
