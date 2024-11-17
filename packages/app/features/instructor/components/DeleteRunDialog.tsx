import { AlertDialog, Button, XStack } from '@my/ui'
import { Run } from 'app/types/run'
import { formatDate, formatTime } from 'app/utils/formatters'

interface DeleteRunDialogProps {
  run: Run | null
  isDeleting: number | null
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteRunDialog({ run, isDeleting, onConfirm, onCancel }: DeleteRunDialogProps) {
  return (
    <AlertDialog open={!!run}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>Delete Run</AlertDialog.Title>
          <AlertDialog.Description>
            Are you sure you want to delete the run scheduled for{' '}
            {run && formatDate(new Date(run.date))} at {run && formatTime(run.time)}?
          </AlertDialog.Description>

          <XStack gap="$3" justifyContent="flex-end">
            <Button onPress={onCancel}>Cancel</Button>
            <Button theme="red" onPress={onConfirm} disabled={isDeleting === run?.id}>
              Delete
            </Button>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  )
}
