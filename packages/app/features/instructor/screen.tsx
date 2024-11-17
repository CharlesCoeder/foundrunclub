import { useEffect, useState } from 'react'
import { Button, YStack, XStack, Text } from '@my/ui'
import { useRouter } from 'solito/navigation'
import { useAuth } from 'app/utils/auth/useAuth'
import { useGetInstructorRuns } from '../../utils/instructors/getInstructorRuns'
import { Run, InstructorRun, EditRunData } from 'app/types/run'
import { useDeleteRun } from 'app/utils/instructors/deleteRun'
import { EditRunModal } from 'app/components/modals/EditRunModal'
import { QRCodeModal } from 'app/components/modals/QRCodeModal'
import { RunList } from './components/RunList'
import { DeleteRunDialog } from './components/DeleteRunDialog'

export function InstructorScreen() {
  const [runs, setRuns] = useState<InstructorRun[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [runToDelete, setRunToDelete] = useState<Run | null>(null)
  const [editingRun, setEditingRun] = useState<EditRunData | null>(null)
  const [qrCodeRun, setQrCodeRun] = useState<InstructorRun | null>(null)

  const { user, isInstructor, isAdmin } = useAuth()
  const { getUpcomingInstructorRuns } = useGetInstructorRuns()
  const { deleteRun } = useDeleteRun()
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

      <DeleteRunDialog
        run={runToDelete}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setRunToDelete(null)}
      />

      <RunList
        runs={runs}
        loading={loading}
        error={error}
        isDeleting={isDeleting}
        onDelete={handleDeleteRun}
        onEdit={handleEditRun}
        onQrCode={setQrCodeRun}
      />
    </YStack>
  )
}
