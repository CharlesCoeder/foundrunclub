import { Platform } from 'react-native'
import { Run } from 'app/types/run'
import { DEEP_LINK_SCHEMES } from './linking'

export interface RunAttendanceDeepLink {
  type: 'attendance'
  runId: number
  code: string
}

export const generateQRCodeContent = (run: Run | null): string => {
  if (!run) return ''

  const deepLink: RunAttendanceDeepLink = {
    type: 'attendance',
    runId: run.id,
    code: run.qr_code,
  }

  // Use Universal Links for iOS, custom scheme for Android
  const baseUrl = __DEV__
    ? DEEP_LINK_SCHEMES.DEVELOPMENT.scheme
    : Platform.select({
        ios: DEEP_LINK_SCHEMES.PRODUCTION.universal,
        default: DEEP_LINK_SCHEMES.PRODUCTION.scheme,
      })

  const params = encodeURIComponent(JSON.stringify(deepLink))
  return `${baseUrl}/attendance?data=${params}`
}
