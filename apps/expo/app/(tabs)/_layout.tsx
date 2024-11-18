import { Tabs, useRouter, useSegments } from 'expo-router'
import { Home, Calendar, User, PersonStanding, MessageCircle } from '@tamagui/lucide-icons'
import { useAuth } from 'app/utils/auth/useAuth'
import { useEffect } from 'react'

export default function TabsLayout() {
  const { isInstructor, isAdmin, user } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  // Handle authentication protection
  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)'
    const inProfileSection = segments.includes('profile')
    // Check if trying to access own profile (which would be null/undefined when not logged in)
    const isAccessingOwnProfile = segments.includes(`profile/${user?.id}`)

    if (inAuthGroup && inProfileSection && !user && isAccessingOwnProfile) {
      // Only redirect if trying to access own profile without being logged in
      router.replace('/(auth)/register')
    }
  }, [user, segments])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          marginBottom: -5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
          href: user ? '/community' : null,
        }}
      />
      <Tabs.Screen
        name="profile/[id]"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          href: user ? `/profile/${user.id}` : null,
        }}
      />
      <Tabs.Screen
        name="instructor"
        options={{
          title: 'Instructor',
          tabBarIcon: ({ color }) => <PersonStanding size={24} color={color} />,
          href: isInstructor || isAdmin ? '/instructor' : null,
        }}
      />
    </Tabs>
  )
}
