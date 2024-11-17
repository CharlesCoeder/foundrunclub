import { ScrollView, Spinner, Text } from '@my/ui'
import { InstructorRun, Run } from 'app/types/run'
import { RunCard } from './RunCard'

interface RunListProps {
  runs: InstructorRun[] | null
  loading: boolean
  error: string | null
  isDeleting: number | null
  onDelete: (run: Run) => void
  onEdit: (run: InstructorRun) => void
  onQrCode: (run: InstructorRun) => void
}

export function RunList({
  runs,
  loading,
  error,
  isDeleting,
  onDelete,
  onEdit,
  onQrCode,
}: RunListProps) {
  if (loading) {
    return <Spinner size="large" />
  }

  if (error) {
    return <Text color="$red10">{error}</Text>
  }

  if (!runs || runs.length === 0) {
    return <Text>No upcoming runs found.</Text>
  }

  return (
    <ScrollView>
      {runs.map((run) => (
        <RunCard
          key={run.id}
          run={run}
          isDeleting={isDeleting}
          onDelete={onDelete}
          onEdit={onEdit}
          onQrCode={onQrCode}
        />
      ))}
    </ScrollView>
  )
}
