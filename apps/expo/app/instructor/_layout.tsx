import { Stack, useRouter } from 'expo-router'
import { useAuth } from 'app/utils/auth/useAuth'
import { Text, Button, YStack } from '@my/ui'

export default function InstructorLayout() {
  const { user, isInstructor, isAdmin } = useAuth()
  const router = useRouter()

  if (!user || (!isInstructor && !isAdmin)) {
    return (
      <YStack f={1} jc="center" ai="center" p="$4">
        <Text>You do not have permission to access this section.</Text>
        <Button onPress={() => router.push('/')}>Go Back to Home</Button>
      </YStack>
    )
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Instructor',
        }}
      />
      <Stack.Screen
        name="createRun"
        options={{
          title: 'Create Run',
        }}
      />
    </Stack>
  )
}
