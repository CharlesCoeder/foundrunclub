import React, { useState, useCallback } from 'react'
import { useRouter } from 'solito/navigation'
import { YStack, Input, Button, Text, H1 } from 'tamagui'
import { Toast, useToastController, useToastState } from '@my/ui'
import { useSupabase } from 'app/provider/supabase'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()
  const toast = useToastController()
  const currentToast = useToastState()

  const handleLogin = useCallback(async () => {
    if (!supabase) {
      toast.show('Supabase client is not initialized', {
        type: 'error',
      })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      toast.show(error.message, {
        type: 'error',
      })
    } else {
      toast.show('Login successful', {
        type: 'success',
      })
      router.push('/')
    }
  }, [supabase, email, password, router, toast])

  const navigateToSignUp = useCallback(() => {
    router.push('/register')
  }, [router])

  return (
    <YStack gap="$4" maxWidth={600} marginHorizontal="auto" padding="$4">
      <H1>Log In</H1>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Log In'}
      </Button>
      <Text>
        Don't have an account?{' '}
        <Text color="$blue10" onPress={navigateToSignUp}>
          Sign up
        </Text>
      </Text>
      {currentToast && <Toast />}
    </YStack>
  )
}
