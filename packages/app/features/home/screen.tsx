import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  SwitchThemeButton,
  XStack,
  YStack,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { useLink, useRouter } from 'solito/navigation'
import { useSupabase } from '../../provider/supabase'
import { useAuth } from 'app/utils/auth/useAuth'

export function HomeScreen() {
  const router = useRouter()
  const linkProps = useLink({
    href: `/user/nate`,
  })

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

      <Button {...linkProps}>Link to user</Button>

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

      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle bg="$gray8" />
        <Sheet.Frame ai="center" jc="center" gap="$10" bg="$color2">
          <XStack gap="$2">
            <Paragraph ta="center">Made by</Paragraph>
            <Anchor col="$blue10" href="https://twitter.com/natebirdman" target="_blank">
              @natebirdman,
            </Anchor>
            <Anchor
              color="$purple10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
