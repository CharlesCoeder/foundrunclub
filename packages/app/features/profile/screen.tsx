import { useState, useEffect } from 'react'
import { YStack, XStack, Image, Button, H1, Paragraph, Input, TextArea, Spinner } from '@my/ui'
import { useSupabase } from '../../provider/supabase'
import { useRouter, useParams } from 'solito/navigation'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { SafeAreaView } from 'app/components/SafeAreaView'

export function ProfileScreen() {
  const { supabase, user } = useSupabase()
  const router = useRouter()
  const { id } = useParams()

  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editedProfile, setEditedProfile] = useState<any>(null)

  const isOwnProfile = user?.id === id

  useEffect(() => {
    fetchProfile()
  }, [id])

  const fetchProfile = async () => {
    if (!supabase) return

    setIsLoading(true)
    let data, error

    if (isOwnProfile) {
      // If it's the user's own profile, fetch from the users table
      ;({ data, error } = await supabase.from('users').select('*').eq('id', id))
    } else {
      // If it's another user's profile, use the get_public_profile function
      ;({ data, error } = await supabase.rpc('get_public_profile', { profile_id: id }))
    }

    if (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
      setEditedProfile(null)
    } else if (data && data.length > 0) {
      console.log('Fetched profile data:', data)
      setProfile(data[0]) // Set the first (and only) object in the array
      setEditedProfile(data[0])
    } else {
      console.error('No data returned from query')
      // Handle the case where no data is returned
      setProfile(null)
      setEditedProfile(null)
    }
    setIsLoading(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!supabase) return

    const { error } = await supabase.from('users').update(editedProfile).eq('id', user?.id)

    if (error) {
      console.error('Error updating profile:', error)
    } else {
      setProfile(editedProfile)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleReturnHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <SafeAreaView>
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" />
        </YStack>
      </SafeAreaView>
    )
  }

  if (!profile) {
    return (
      <SafeAreaView>
        <YStack f={1} jc="center" ai="center">
          <Paragraph>Profile not found</Paragraph>
          <Button onPress={handleReturnHome}>Return to Home</Button>
        </YStack>
      </SafeAreaView>
    )
  }

  console.log('profile', profile)

  return (
    <SafeAreaView>
      <YStack f={1} jc="flex-start" ai="center" p="$4">
        <XStack w="100%" jc="flex-start" mb="$4" mt="$2">
          <Button icon={ChevronLeft} theme="alt2" onPress={handleReturnHome}>
            Return to Home
          </Button>
        </XStack>

        <Image
          source={{ uri: profile?.profile_image_url || 'https://via.placeholder.com/150' }}
          width={150}
          height={150}
          borderRadius={75}
          mb="$4"
        />

        {isEditing ? (
          <YStack ai="stretch" w="100%" maxWidth={300}>
            <Input
              value={editedProfile.first_name}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, first_name: text })}
              placeholder="First Name"
              mb="$2"
            />
            <Input
              value={editedProfile.last_name}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, last_name: text })}
              placeholder="Last Name"
              mb="$2"
            />
            <TextArea
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
              placeholder="Bio"
              mb="$4"
            />
            <XStack jc="space-between">
              <Button onPress={handleSave}>Save</Button>
              <Button onPress={handleCancel} theme="alt2">
                Cancel
              </Button>
            </XStack>
          </YStack>
        ) : (
          <YStack ai="center">
            <H1 mb="$2">
              {profile.first_name} {profile.last_name}
            </H1>
            <Paragraph mb="$4">{profile.bio || 'No bio available'}</Paragraph>
            {isOwnProfile && <Button onPress={handleEdit}>Edit Profile</Button>}
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  )
}
