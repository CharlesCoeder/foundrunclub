import { View, Text, styled } from '@tamagui/core'

const StyledView = styled(View, {
  borderRadius: 9999,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$blue10',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
})

const StyledText = styled(Text, {
  color: '$color',
  fontWeight: 'bold',
  userSelect: 'none',
  textAlign: 'center',

  variants: {
    size: {
      small: {
        fontSize: 14,
        lineHeight: 14,
      },
      medium: {
        fontSize: 40,
        lineHeight: 40,
      },
      large: {
        fontSize: 56,
        lineHeight: 56,
      },
    },
    chars: {
      1: {},
      2: {
        transform: [{ scale: 1 }],
      },
      3: {
        transform: [{ scale: 0.95 }],
      },
      4: {
        transform: [{ scale: 0.85 }],
      },
    },
  } as const,

  defaultVariants: {
    size: 'medium',
    chars: 2,
  },
})

interface DefaultProfilePictureProps {
  name: string
  size?: 'small' | 'medium' | 'large'
}

export function DefaultProfilePicture({ name, size = 'medium' }: DefaultProfilePictureProps) {
  const getInitials = (name: string) => {
    // Get first letter of each word, up to 4 characters
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 4)
  }

  const initials = getInitials(name)
  const charCount = Math.min(initials.length, 4) as 1 | 2 | 3 | 4

  // Adjust base font size for small avatars with multiple characters
  const adjustedSize =
    size === 'small' && charCount > 2
      ? {
          fontSize: 11,
          lineHeight: 11,
        }
      : {}

  return (
    <StyledView>
      <StyledText size={size} chars={charCount} {...adjustedSize}>
        {initials}
      </StyledText>
    </StyledView>
  )
}
