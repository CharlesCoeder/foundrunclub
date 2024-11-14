import { Dialog, YStack, Button, XStack } from '@my/ui'
import QRCode from 'react-native-qrcode-svg'
import { generateQRCodeContent } from 'app/utils/attendance/qrCode'
import { Run } from 'app/types/run'

interface QRCodeModalProps {
  run: Run | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QRCodeModal({ run, open, onOpenChange }: QRCodeModalProps) {
  const qrContent = run ? generateQRCodeContent(run) : ''

  if (!run || !qrContent) return null

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          width="95%"
          maxWidth={400}
          marginHorizontal="auto"
          marginVertical="10%"
          overflow="hidden"
          scale={0.95}
          borderRadius="$4"
          padding="$0"
          backgroundColor="$background"
        >
          <Dialog.Title padding="$4" paddingBottom="$2">
            Attendance QR Code
          </Dialog.Title>

          <YStack padding="$4" alignItems="center" justifyContent="center">
            <QRCode value={qrContent} size={300} backgroundColor="white" color="black" />
          </YStack>

          <XStack
            gap="$3"
            justifyContent="flex-end"
            padding="$4"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <Dialog.Close asChild>
              <Button variant="outlined">Close</Button>
            </Dialog.Close>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
