import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/lib/supabaseClient';
import type { Character, Message } from '@/types/database';
import type { 
  ChatSessionWithCharacter, 
  ChatSessionWithLastMessage,
  SessionQueryResult,
  MessageQueryResult 
} from '@/app/types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Characters', 'ChatSessions', 'Messages'],
  endpoints: (builder) => ({
    // Get all characters
    getCharacters: builder.query<Character[], void>({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from('characters')
            .select('*')
            .order('name');

          if (error) throw error;
          return { data: (data as Character[]) || [] };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Characters'],
    }),

    // Get chat sessions for a user
    getChatSessions: builder.query<ChatSessionWithLastMessage[], string>({
      async queryFn(userId) {
        try {
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('chat_sessions')
            .select(`
              *,
              characters (*)
            `)
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

          if (sessionsError) throw sessionsError;

          // Fetch last message for each session
          const sessionsWithMessages = await Promise.all(
            ((sessionsData as SessionQueryResult[]) || []).map(
              async (session: SessionQueryResult) => {
                const { data: lastMessage } = await supabase
                  .from('messages')
                  .select('content, created_at')
                  .eq('chat_session_id', session.id)
                  .order('created_at', { ascending: false })
                  .limit(1)
                  .single();

                return {
                  ...session,
                  last_message: lastMessage
                    ? {
                        content: (lastMessage as MessageQueryResult).content,
                        created_at: (lastMessage as MessageQueryResult).created_at,
                      }
                    : undefined,
                } as ChatSessionWithLastMessage;
              }
            )
          );

          return { data: sessionsWithMessages };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: ['ChatSessions'],
    }),

    // Get a single chat session with character info
    getChatSession: builder.query<ChatSessionWithCharacter, { sessionId: string; userId: string }>({
      async queryFn({ sessionId, userId }) {
        try {
          const { data, error } = await supabase
            .from('chat_sessions')
            .select(`
              *,
              characters (*)
            `)
            .eq('id', sessionId)
            .eq('user_id', userId)
            .single();

          if (error) throw error;
          if (!data) {
            return { error: { status: 'NOT_FOUND', error: 'Chat session not found' } };
          }

          return { data: data as ChatSessionWithCharacter };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, { sessionId }) => [{ type: 'ChatSessions', id: sessionId }],
    }),

    // Get messages for a chat session
    getMessages: builder.query<Message[], string>({
      async queryFn(sessionId) {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_session_id', sessionId)
            .order('created_at', { ascending: true });

          if (error) throw error;
          return { data: (data as Message[]) || [] };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, sessionId) => [{ type: 'Messages', id: sessionId }],
    }),

    // Create a new chat session
    createChatSession: builder.mutation<{ id: string }, { userId: string; characterId: string }>({
      async queryFn({ userId, characterId }) {
        try {
          const { data, error } = await supabase
            .from('chat_sessions')
            // @ts-expect-error - Supabase insert type mismatch
            .insert({
              user_id: userId,
              character_id: characterId,
            })
            .select()
            .single();

          if (error) throw error;
          // @ts-expect-error - Supabase type mismatch
          return { data: { id: data.id } };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['ChatSessions'],
    }),

    // Create a new message
    createMessage: builder.mutation<Message, { sessionId: string; role: 'user' | 'assistant'; content: string }>({
      async queryFn({ sessionId, role, content }) {
        try {
          const { data, error } = await supabase
            .from('messages')
            // @ts-expect-error - Supabase insert type mismatch
            .insert({
              chat_session_id: sessionId,
              role,
              content,
            })
            .select()
            .single();

          if (error) throw error;
          return { data: data as Message };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { sessionId }) => [
        { type: 'Messages', id: sessionId },
        'ChatSessions',
      ],
    }),

    // Update chat session timestamp
    updateChatSession: builder.mutation<void, string>({
      async queryFn(sessionId) {
        try {
          const { error } = await supabase
            .from('chat_sessions')
            // @ts-expect-error - Supabase update type mismatch
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId);

          if (error) throw error;
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['ChatSessions'],
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useGetChatSessionsQuery,
  useGetChatSessionQuery,
  useGetMessagesQuery,
  useCreateChatSessionMutation,
  useCreateMessageMutation,
  useUpdateChatSessionMutation,
} = chatApi;

