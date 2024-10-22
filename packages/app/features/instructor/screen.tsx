import { useEffect, useState } from 'react'
import { Button, YStack, XStack, Text, ScrollView, Spinner, Card } from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/utils/auth/useAuth'
import { useGetInstructorRuns } from '../../utils/instructors/getInstructorRuns'
import { Run } from 'app/types/run'
export function InstructorScreen() {
  const [runs, setRuns] = useState<Run[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user, isInstructor, isAdmin } = useAuth()
  const { getUpcomingInstructorRuns } = useGetInstructorRuns()
  const router = useRouter()

  useEffect(() => {
    const fetchRuns = async () => {
      setLoading(true)
      const { data, error } = await getUpcomingInstructorRuns()
      if (error) {
        setError('Failed to fetch runs')
        setRuns(null)
      } else {
        setRuns(data)
        setError(null)
      }
      setLoading(false)
    }

    fetchRuns()
  }, [])

  const handleCreateRun = () => {
    router.push('/instructor/createRun')
  }

  if (!user || (!isInstructor && !isAdmin)) {
    return <Text>You do not have permission to access this page.</Text>
  }

  return (
    <YStack gap="$4" padding="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="bold">
          Upcoming Runs
        </Text>
        <Button onPress={handleCreateRun}>Create New Run</Button>
      </XStack>

      {loading ? (
        <Spinner size="large" />
      ) : error ? (
        <Text color="$red10">{error}</Text>
      ) : runs && runs.length > 0 ? (
        <ScrollView>
          {runs.map((run) => (
            <Card key={run.id} marginVertical="$2" padding="$3">
              <Text fontWeight="bold">
                {new Date(run.date).toLocaleDateString()} at {run.time}
              </Text>
              <Text>Distance: {run.distance} km</Text>
              <Text>Target Pace: {run.target_pace}</Text>
              {run.route && <Text>Route: {run.route}</Text>}
              {run.meetup_location && <Text>Meetup: {run.meetup_location}</Text>}
            </Card>
          ))}
        </ScrollView>
      ) : (
        <Text>No upcoming runs found.</Text>
      )}
    </YStack>
  )
}
