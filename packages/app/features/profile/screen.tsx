import { useState, useEffect } from 'react'
import {
  YStack,
  XStack,
  Button,
  H1,
  Paragraph,
  Input,
  TextArea,
  Spinner,
  Separator,
  ScrollView,
} from '@my/ui'
import { useSupabase } from '../../provider/supabase'
import { useParams } from 'solito/navigation'
import ImagePicker from 'app/features/profile/ImagePicker/ImagePicker'
import { Platform } from 'react-native'
import { ProfilePicture } from 'app/components/ProfilePicture'
import { RewardsDashboard } from 'app/components/rewards/RewardsDashboard'
import { AttendedRuns } from './AttendedRuns'

export function ProfileScreen() {
  const { supabase, user } = useSupabase()
  const { id } = useParams()

  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editedProfile, setEditedProfile] = useState<any>(null)
  const [tempImageUri, setTempImageUri] = useState<string | null>(null)

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
    if (!supabase || !user) return

    try {
      let publicUrl = profile.profile_image_url

      if (tempImageUri) {
        const fileName = `${user.id}_${Date.now()}.jpg`

        // Upload image
        const { data, error: uploadError } = await uploadImage(tempImageUri, fileName)

        if (uploadError) throw uploadError

        // Get the public URL for the uploaded image
        const {
          data: { publicUrl: newPublicUrl },
        } = await supabase.storage.from('profile_images').getPublicUrl(fileName)

        publicUrl = newPublicUrl
      }

      // Update the profile with all changes, including the new image URL if applicable
      const { error: updateError } = await supabase
        .from('users')
        .update({ ...editedProfile, profile_image_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile({ ...editedProfile, profile_image_url: publicUrl })
      setIsEditing(false)
      setTempImageUri(null)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const uploadImage = async (uri: string, fileName: string) => {
    if (!supabase) {
      throw new Error('Supabase client is not initialized')
    }

    if (Platform.OS === 'web') {
      // For web
      const response = await fetch(uri)
      const blob = await response.blob()

      return await supabase.storage.from('profile_images').upload(fileName, blob, {
        contentType: 'image/jpeg',
      })
    } else {
      // For native (iOS and Android)
      const response = await fetch(uri)
      const blob = await response.blob()
      const arrayBuffer = await new Response(blob).arrayBuffer()

      return await supabase.storage.from('profile_images').upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
      })
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setTempImageUri(null)
  }

  const handleImageSelect = (uri: string) => {
    setTempImageUri(uri)
    setEditedProfile((prev: any) => ({ ...prev, profile_image_url: uri }))
  }

  const renderProfileImage = () => {
    if (isEditing) {
      return (
        <ImagePicker
          onImageSelect={handleImageSelect}
          currentImageUri={tempImageUri || profile.profile_image_url}
          name={`${profile.first_name} ${profile.last_name}`}
        />
      )
    } else {
      return (
        <ProfilePicture
          imageUrl={profile.profile_image_url}
          name={`${profile.first_name} ${profile.last_name}`}
          size="medium"
          userId={profile.id}
        />
      )
    }
  }

  if (isLoading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (!profile) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Paragraph>Profile not found</Paragraph>
      </YStack>
    )
  }

  return (
    <ScrollView>
      <YStack jc="flex-start" ai="center" p="$4">
        <YStack ai="center" mb="$4">
          {renderProfileImage()}
        </YStack>

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
          <YStack ai="center" w="100%">
            <H1 mb="$2">
              {profile.first_name} {profile.last_name}
            </H1>
            <Paragraph mb="$4">{profile.bio || 'No bio available'}</Paragraph>
            {isOwnProfile && <Button onPress={handleEdit}>Edit Profile</Button>}

            <YStack w="100%" mt="$4">
              <Separator mb="$4" />
              {profile?.id && <AttendedRuns userId={profile.id} />}
              <Separator my="$4" />
              {profile?.id && <RewardsDashboard userId={profile.id} />}
            </YStack>
          </YStack>
        )}
      </YStack>
    </ScrollView>
  )
}
