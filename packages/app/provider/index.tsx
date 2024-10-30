import { useColorScheme } from 'react-native'
import {
  CustomToast,
  TamaguiProvider,
  type TamaguiProviderProps,
  ToastProvider,
  config,
  isWeb,
} from '@my/ui'
import { ToastViewport } from './ToastViewport'
import { SupabaseProvider } from './supabase'
import { SafeAreaProvider, SafeAreaView } from './safe-area'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme()

  return (
    <SupabaseProvider>
      <SafeAreaProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
          {...rest}
        >
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={isWeb ? [] : ['mobile']}
          >
            <SafeAreaView style={{ flex: 1 }}>
              {children}
              <CustomToast />
              <ToastViewport />
            </SafeAreaView>
          </ToastProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </SupabaseProvider>
  )
}
