import { View, Text, styled } from '@tamagui/core'

const StyledView = styled(View, {
  borderRadius: 75,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$blue10',

  variants: {
    size: {
      small: {
        width: 100,
        height: 100,
      },
      medium: {
        width: 150,
        height: 150,
      },
      large: {
        width: 200,
        height: 200,
      },
    },
  } as const,

  defaultVariants: {
    size: 'medium',
  },
})

const StyledText = styled(Text, {
  color: '$color',
  fontWeight: 'bold',
  userSelect: 'none',

  variants: {
    size: {
      small: {
        fontSize: 24,
      },
      medium: {
        fontSize: 40,
      },
      large: {
        fontSize: 56,
      },
    },
  } as const,

  defaultVariants: {
    size: 'medium',
  },
})

interface DefaultProfilePictureProps {
  name: string
  size?: 'small' | 'medium' | 'large'
}

export function DefaultProfilePicture({ name, size = 'medium' }: DefaultProfilePictureProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <StyledView size={size}>
      <StyledText size={size}>{initials}</StyledText>
    </StyledView>
  )
}
