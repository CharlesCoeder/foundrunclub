import { YStack } from '@my/ui'
import { SolitoImage } from 'solito/image'
import { DefaultProfilePicture } from './DefaultProfilePicture'
import { useRouter } from 'solito/navigation'

interface ProfilePictureProps {
  imageUrl?: string | null
  name: string
  size?: 'small' | 'medium' | 'large'
  userId?: string
  interactive?: boolean
}

export function ProfilePicture({
  imageUrl,
  name,
  size = 'medium',
  userId,
  interactive = false,
}: ProfilePictureProps) {
  const router = useRouter()

  const dimensions = {
    small: 40,
    medium: 150,
    large: 200,
  }

  const handlePress = () => {
    if (interactive && userId) {
      router.push(`/profile/${userId}`)
    }
  }

  const containerProps = interactive
    ? {
        cursor: 'pointer',
        opacity: 1,
        pressStyle: { opacity: 0.7 },
        onPress: handlePress,
      }
    : {}

  return (
    <YStack {...containerProps}>
      {imageUrl ? (
        <SolitoImage
          src={imageUrl}
          width={dimensions[size]}
          height={dimensions[size]}
          style={{ borderRadius: dimensions[size] / 2 }}
          alt={`${name}'s profile picture`}
          contentFit="cover"
          onLayout={() => {}}
        />
      ) : (
        <DefaultProfilePicture name={name} size={size} />
      )}
    </YStack>
  )
}