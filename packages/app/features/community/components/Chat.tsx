import { useEffect, useState } from 'react'
import { ScrollView, YStack, Button, Text, Spinner } from 'tamagui'
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

  // Load initial messages
  useEffect(() => {
    loadMessages(true)
  }, [supabase]) // Depend on supabase to ensure we have the client

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

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (scrollViewRef) {
      scrollViewRef.scrollToEnd({ animated: true })
    }
  }, [messages.length])

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
    <YStack f={1}>
      <ScrollView
        ref={setScrollViewRef}
        f={1}
        p="$4"
        bounces={false}
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      >
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

        <YStack space="$3">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
        </YStack>
      </ScrollView>

      <ChatInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={sendMessage}
        sending={sending}
      />
    </YStack>
  )
}
