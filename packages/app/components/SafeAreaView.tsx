import React, { useEffect, useState } from 'react'
import { YStack } from '@my/ui'
import { Platform } from 'react-native'

export const SafeAreaView: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [SafeAreaViewMobile, setSafeAreaViewMobile] = useState<React.ComponentType<any> | null>(
    null
  )

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-safe-area-context').then((module) => {
        setSafeAreaViewMobile(module.SafeAreaView)
      })
    }
  }, [])

  if (Platform.OS !== 'web' && SafeAreaViewMobile) {
    return <SafeAreaViewMobile style={{ flex: 1 }}>{children}</SafeAreaViewMobile>
  }

  return (
    <YStack f={1} pt="$4">
      {children}
    </YStack>
  )
}
