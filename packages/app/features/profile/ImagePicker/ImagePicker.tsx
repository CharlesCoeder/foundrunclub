import React from 'react'
import { Button, YStack } from '@my/ui'
import { SolitoImage } from 'solito/image'
import * as ExpoImagePicker from 'expo-image-picker'
import { DefaultProfilePicture } from '../../../components/DefaultProfilePicture'

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
      {currentImageUri ? (
        <SolitoImage
          src={currentImageUri}
          width={150}
          height={150}
          style={{ borderRadius: 75 }}
          alt="Selected image"
          contentFit="cover"
          onLayout={() => {}}
        />
      ) : (
        <DefaultProfilePicture name={name} />
      )}
      <Button onPress={handleImageSelection}>Select Image</Button>
    </YStack>
  )
}

export default ImagePicker
