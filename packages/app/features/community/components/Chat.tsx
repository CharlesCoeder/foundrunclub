import { useState, useCallback, useEffect, useContext } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSupabase } from 'app/provider/supabase'
import { useAuth } from 'app/utils/auth/useAuth'
import { ChatMessage } from 'app/types/chat'
import { toGiftedMessage, fromGiftedMessage } from 'app/utils/chat/messageTransforms'
import { YStack, Spinner } from '@my/ui'
import { Platform } from 'react-native'
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs'
import { ProfilePicture } from 'app/components/ProfilePicture'

const MESSAGES_PER_PAGE = 20

export function Chat() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const tabBarHeight = useContext(BottomTabBarHeightContext) || 0

  // Load initial messages
  useEffect(() => {
    loadMessages(true)
  }, [])

  const loadMessages = async (isInitial = false) => {
    if (!supabase || (loadingMore && !isInitial)) return

    isInitial ? setLoading(true) : setLoadingMore(true)
    try {
      const lastMessage = messages[messages.length - 1]
      const query = supabase
        .from('chat_messages')
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          user:users(first_name, last_name, profile_image_url)
        `
        )
        .order('created_at', { ascending: false })
        .limit(MESSAGES_PER_PAGE)

      if (lastMessage && !isInitial) {
        query.lt('created_at', new Date(lastMessage.createdAt).toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        const giftedMessages = data.map((msg) => toGiftedMessage(msg as unknown as ChatMessage))
        setHasMore(data.length === MESSAGES_PER_PAGE)
        setMessages((prev) => (isInitial ? giftedMessages : [...prev, ...giftedMessages]))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      isInitial ? setLoading(false) : setLoadingMore(false)
    }
  }

  // Set up realtime subscription
  useEffect(() => {
    if (!supabase) return

    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        async (payload) => {
          const { data, error } = await supabase
            .from('chat_messages')
            .select(
              `
              id,
              content,
              created_at,
              user_id,
              user:users(first_name, last_name, profile_image_url)
            `
            )
            .eq('id', payload.new.id)
            .single()

          if (error || !data) {
            console.error('Error fetching new message:', error)
            return
          }

          const newMessage = toGiftedMessage(data as unknown as ChatMessage)
          setMessages((prev) => [newMessage, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (!user || !supabase || newMessages.length === 0) return

      const newMessage = newMessages[0]
      const supabaseMessage = fromGiftedMessage(newMessage)

      try {
        const { error } = await supabase.from('chat_messages').insert([
          {
            content: supabaseMessage.content,
            user_id: user.id,
          },
        ])

        if (error) throw error
      } catch (error) {
        console.error('Error sending message:', error)
        // You might want to add error handling UI here
      }
    },
    [user, supabase]
  )

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: user?.id || '',
        name: `${user?.user_metadata?.first_name || ''} ${
          user?.user_metadata?.last_name || ''
        }`.trim(),
        avatar: user?.user_metadata?.profile_image_url,
      }}
      renderAvatar={(props) => {
        const avatar = props.currentMessage?.user?.avatar
        const avatarUrl = typeof avatar === 'string' ? avatar : undefined

        return (
          <ProfilePicture
            imageUrl={avatarUrl}
            name={props.currentMessage?.user?.name || ''}
            size="small"
            userId={props.currentMessage?.user?._id as string}
            tooltip
            interactive
          />
        )
      }}
      loadEarlier={hasMore}
      isLoadingEarlier={loadingMore}
      onLoadEarlier={() => loadMessages(false)}
      infiniteScroll
      bottomOffset={Platform.select({
        ios: tabBarHeight,
        android: 0,
      })}
      keyboardShouldPersistTaps="handled"
      listViewProps={{
        style: {
          backgroundColor: 'white',
        },
        contentContainerStyle: {
          flexGrow: 1,
        },
      }}
    />
  )
}
