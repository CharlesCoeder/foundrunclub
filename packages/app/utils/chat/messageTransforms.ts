import { ChatMessage } from 'app/types/chat'
import { IMessage } from 'react-native-gifted-chat'

export const toGiftedMessage = (message: ChatMessage): IMessage => ({
  _id: message.id,
  text: message.content,
  createdAt: new Date(message.created_at),
  user: {
    _id: message.user_id,
    name: `${message.user.first_name} ${message.user.last_name}`,
    avatar: message.user.profile_image_url || undefined,
  },
})

export const fromGiftedMessage = (message: IMessage): Omit<ChatMessage, 'user'> => ({
  id: message._id.toString(),
  content: message.text,
  created_at: (message.createdAt instanceof Date
    ? message.createdAt
    : new Date(message.createdAt)
  ).toISOString(),
  user_id: message.user._id.toString(),
})
