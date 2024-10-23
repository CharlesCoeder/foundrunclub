import React from 'react'
import { Button, YStack } from '@my/ui'
import * as ExpoImagePicker from 'expo-image-picker'
import { ProfilePicture } from 'app/components/ProfilePicture'

interface ImagePickerProps {
  onImageSelect: (uri: string) => void
  currentImageUri?: string
  name: string
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect, currentImageUri, name }) => {
  const handleImageSelection = async () => {
    const permissionResult = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!")
      return
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelect(result.assets[0].uri)
    }
  }

  return (
    <YStack ai="center">
      <ProfilePicture imageUrl={currentImageUri} name={name} size="medium" />
      <Button onPress={handleImageSelection}>Select Image</Button>
    </YStack>
  )
}

export default ImagePicker
