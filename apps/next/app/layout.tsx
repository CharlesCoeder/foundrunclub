import type { Metadata } from 'next'
import { NextTamaguiProvider } from './NextTamaguiProvider'

export const metadata: Metadata = {
  title: 'FOUND Run Club',
  description:
    'Join fellow FOUND residents for group runs, track your progress, and stay fit together. Your student housing running community awaits!',
  icons: '/favicon.ico', // Gym shoes icons created by Arslan Haider - Flaticon
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // You can use `suppressHydrationWarning` to avoid the warning about mismatched content during hydration in dev mode
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  )
}
