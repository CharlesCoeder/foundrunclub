import React, { useRef } from 'react'
import { Button, YStack } from '@my/ui'
import { useDropzone } from 'react-dropzone'
import { ProfilePicture } from 'app/components/ProfilePicture'

interface ImagePickerProps {
  onImageSelect: (uri: string) => void
  currentImageUri?: string
  name: string
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect, currentImageUri, name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelection = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      onImageSelect(imageUrl)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: handleImageSelection,
  })

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleImageSelection(Array.from(files))
    }
  }

  return (
    <YStack ai="center">
      <div
        {...getRootProps()}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        <input {...getInputProps()} />
        <ProfilePicture imageUrl={currentImageUri} name={name} size="medium" />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <Button onPress={handleButtonClick}>Select Image</Button>
    </YStack>
  )
}

export default ImagePicker
