import { useEffect, useState } from 'react'
import { Button, YStack, XStack, Text, ScrollView, Spinner, Card, AlertDialog } from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/utils/auth/useAuth'
import { useGetInstructorRuns } from '../../utils/instructors/getInstructorRuns'
import { Run, InstructorRun, EditRunData } from 'app/types/run'
import { useDeleteRun } from 'app/utils/instructors/deleteRun'
import { Trash, Edit3, QrCode } from '@tamagui/lucide-icons'
import { EditRunModal } from 'app/components/modals/EditRunModal'
import { QRCodeModal } from 'app/components/modals/QRCodeModal'

export function InstructorScreen() {
  const [runs, setRuns] = useState<InstructorRun[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { deleteRun } = useDeleteRun()
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [runToDelete, setRunToDelete] = useState<Run | null>(null)
  const [editingRun, setEditingRun] = useState<EditRunData | null>(null)
  const [qrCodeRun, setQrCodeRun] = useState<InstructorRun | null>(null)

  const { user, isInstructor, isAdmin } = useAuth()
  const { getUpcomingInstructorRuns } = useGetInstructorRuns()
  const router = useRouter()

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

  useEffect(() => {
    fetchRuns()
  }, [])

  const handleCreateRun = () => {
    router.push('/instructor/createRun')
  }

  const handleDeleteRun = async (run: Run) => {
    setRunToDelete(run)
  }

  const confirmDelete = async () => {
    if (!runToDelete) return

    try {
      setIsDeleting(runToDelete.id)
      await deleteRun(runToDelete.id)
      await fetchRuns()
    } catch (error) {
      setError('Failed to delete run')
    } finally {
      setIsDeleting(null)
      setRunToDelete(null)
    }
  }

  const handleEditRun = (run: InstructorRun) => {
    // Transform InstructorRun into EditRunData
    const editRunData: EditRunData = {
      id: run.id,
      date: run.date,
      time: run.time,
      target_pace: run.target_pace,
      distance: run.distance,
      route: run.route,
      meetup_location: run.meetup_location,
      qr_code: run.qr_code,
      status: run.status,
      instructor_ids: run.run_instructors.map((ri) => ri.instructor_id),
    }

    setEditingRun(editRunData)
  }

  if (!user || (!isInstructor && !isAdmin)) {
    return <Text>You do not have permission to access this page.</Text>
  }

  return (
    <YStack gap="$4" padding="$4">
      <QRCodeModal
        run={qrCodeRun}
        open={!!qrCodeRun}
        onOpenChange={(open) => !open && setQrCodeRun(null)}
      />

      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="bold">
          Upcoming Runs
        </Text>
        <Button onPress={handleCreateRun}>Create New Run</Button>
      </XStack>

      {/* 
       Run Dialog */}
      {editingRun && (
        <EditRunModal
          open={!!editingRun}
          onOpenChange={(open) => !open && setEditingRun(null)}
          run={editingRun}
          onRunUpdated={() => {
            fetchRuns()
            setEditingRun(null)
          }}
        />
      )}

      {/* This component is giving a warning about duplicate keys*/}
      <AlertDialog open={!!runToDelete}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <AlertDialog.Title>Delete Run</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete the run scheduled for{' '}
              {runToDelete && new Date(runToDelete.date).toLocaleDateString()} at{' '}
              {runToDelete?.time}?
            </AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <Button onPress={() => setRunToDelete(null)}>Cancel</Button>
              <Button theme="red" onPress={confirmDelete} disabled={isDeleting === runToDelete?.id}>
                Delete
              </Button>
            </XStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>

      {loading ? (
        <Spinner size="large" />
      ) : error ? (
        <Text color="$red10">{error}</Text>
      ) : runs && runs.length > 0 ? (
        <ScrollView>
          {runs.map((run) => (
            <Card key={run.id} marginVertical="$2" padding="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text fontWeight="bold">
                    {new Date(run.date).toLocaleDateString()} at {run.time}
                  </Text>
                  <Text>Distance: {run.distance} mi</Text>
                  <Text>Target Pace: {run.target_pace}</Text>
                  {run.route && <Text>Route: {run.route}</Text>}
                  {run.meetup_location && <Text>Meetup: {run.meetup_location}</Text>}
                </YStack>
                <XStack gap="$2">
                  <Button icon={QrCode} theme="green" size="$3" onPress={() => setQrCodeRun(run)} />
                  <Button icon={Edit3} theme="blue" size="$3" onPress={() => handleEditRun(run)} />
                  <Button
                    icon={Trash}
                    theme="red"
                    size="$3"
                    onPress={() => handleDeleteRun(run)}
                    disabled={isDeleting === run.id}
                    opacity={isDeleting === run.id ? 0.5 : 1}
                  />
                </XStack>
              </XStack>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <Text>No upcoming runs found.</Text>
      )}
    </YStack>
  )
}
