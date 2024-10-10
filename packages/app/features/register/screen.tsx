import React, { useState, useCallback } from 'react'
import { useRouter } from 'solito/navigation'
import { YStack, Input, Button, Text, H1 } from 'tamagui'
import { Toast, useToastController } from '@my/ui'
import { useSupabase } from 'app/provider/supabase'

export function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()
  const toast = useToastController()

  const handleSignUp = useCallback(async () => {
    if (!supabase) {
      toast.show('Supabase client is not initialized', {
        type: 'error',
      })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })
    setLoading(false)

    if (error) {
      console.error('Signup error:', error) // Log the error
      toast.show(error.message, {
        type: 'error',
      })
    } else {
      toast.show('Check your email for the confirmation link', {
        type: 'success',
      })
      router.push('/')
    }
  }, [supabase, email, password, firstName, lastName, router, toast])

  const navigateToLogin = useCallback(() => {
    router.push('/login')
  }, [router])

  return (
    <YStack gap="$4" maxWidth={600} marginHorizontal="auto" padding="$4">
      <H1>Sign Up</H1>
      <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={handleSignUp} disabled={loading}>
        {loading ? 'Loading...' : 'Sign Up'}
      </Button>
      <Text>
        Already have an account?{' '}
        <Text color="$blue10" onPress={navigateToLogin}>
          Log in
        </Text>
      </Text>
      <Toast />
    </YStack>
  )
}
