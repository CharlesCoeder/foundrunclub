import { YStack, Tooltip, Text } from '@my/ui'
import { SolitoImage } from 'solito/image'
import { DefaultProfilePicture } from './DefaultProfilePicture'
import { useRouter } from 'solito/navigation'
import { ReactNode } from 'react'

// Define custom type that extends the original props
type CustomTooltipContentProps = {
  children: ReactNode
} & React.ComponentProps<typeof Tooltip.Content>

// Create a custom tooltip content component. Tamagui's Tooltip.Content does not have prop {children: Element} for some reason
// this might be worth looking into later
const CustomTooltipContent = ({ children, ...props }: CustomTooltipContentProps) => {
  return <Tooltip.Content {...props}>{children}</Tooltip.Content>
}

interface ProfilePictureProps {
  imageUrl?: string | null
  name: string
  size?: 'small' | 'medium' | 'large'
  userId?: string
  tooltip?: boolean
  interactive?: boolean
}

export function ProfilePicture({
  imageUrl,
  name,
  size = 'medium',
  userId,
  tooltip = false,
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

  const content = (
    <YStack width={dimensions[size]} height={dimensions[size]} {...containerProps}>
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

  // Wrap in Tooltip if tooltip prop is true
  if (tooltip) {
    return (
      <Tooltip>
        <Tooltip.Trigger>{content}</Tooltip.Trigger>

        <CustomTooltipContent>
          <YStack padding="$2" backgroundColor="$background" borderRadius="$2">
            <Text size="$2">{name}</Text>
          </YStack>
        </CustomTooltipContent>
      </Tooltip>
    )
  }

  return content
}
