import { useEffect, useState } from 'react'
import { ScrollView, YStack, Button, Text, Spinner } from 'tamagui'
import { Platform } from 'react-native'
import { useSupabase } from 'app/provider/supabase'
import { useAuth } from 'app/utils/auth/useAuth'
import { ChatMessage } from 'app/types/chat'
import { ChatMessageItem } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

const MESSAGES_PER_PAGE = 20

export function Chat() {
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>(null)
  const [isScrollReady, setIsScrollReady] = useState(false)

  // Load initial messages
  useEffect(() => {
    loadMessages(true).then(() => {
      setIsScrollReady(true)
    })
  }, [supabase])

  const loadMessages = async (isInitial = false) => {
    if (!supabase) return

    setLoading(true)
    try {
      const lastMessageId = isInitial ? null : messages[0]?.id

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

      if (lastMessageId) {
        query.lt('created_at', messages[0].created_at)
      }

      const { data, error } = (await query) as PostgrestSingleResponse<ChatMessage[]>

      if (error) throw error

      if (data) {
        setHasMore(data.length === MESSAGES_PER_PAGE)
        const orderedData = [...data].reverse()
        setMessages((prev) => (isInitial ? orderedData : [...orderedData, ...prev]))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Separate effect for initial scroll
  useEffect(() => {
    if (isScrollReady && scrollViewRef && messages.length > 0) {
      scrollViewRef.scrollToEnd({ animated: false })
    }
  }, [isScrollReady, messages.length])

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
          const { data, error } = (await supabase
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
            .single()) as PostgrestSingleResponse<ChatMessage>

          if (error || !data) {
            console.error('Error fetching new message:', error)
            return
          }

          setMessages((prev) => [...prev, data as ChatMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const sendMessage = async () => {
    if (!user || !supabase || !newMessage.trim() || sending) return

    setSending(true)
    try {
      const { error } = await supabase.from('chat_messages').insert([
        {
          content: newMessage.trim(),
          user_id: user.id,
        },
      ])

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <YStack f={1} pos="relative" height="100%">
      <ScrollView
        ref={setScrollViewRef}
        f={1}
        bounces={false}
        scrollEnabled={isScrollReady}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
          flexGrow: 1,
          justifyContent: 'flex-end'
        }}
        invertStickyHeaders
      >
        <YStack gap="$3" jc="flex-end">
          {hasMore && !loading && (
            <Button onPress={() => loadMessages(false)} theme="alt2" mb="$4">
              <Text>Load More</Text>
            </Button>
          )}

          {loading && (
            <YStack ai="center" p="$4">
              <Spinner />
            </YStack>
          )}

          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
        </YStack>
      </ScrollView>

      <YStack
        pos="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="$background"
        zi={1000}
        elevation={5}
        style={
          Platform.OS === 'web'
            ? {
                position: 'fixed', // Apply fixed position through style prop for web
              }
            : undefined
        }
      >
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={sendMessage}
          sending={sending}
        />
      </YStack>
    </YStack>
  )
}
