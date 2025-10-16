import { supabase } from "@/lib/supabaseClient";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message } from "@/types/database";

export type MessageInsertHandler = (message: Message) => void;

export function subscribeToChatMessages(
  sessionId: string,
  onMessageInsert: MessageInsertHandler
): RealtimeChannel {
  const channel = supabase
    .channel(`chat_${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_session_id=eq.${sessionId}`,
      },
      (payload) => {
        const newMessage = payload.new as Message;
        onMessageInsert(newMessage);
      }
    )
    .subscribe();

  return channel;
}

export function unsubscribeChannel(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

export function isDuplicateMessage(
  messages: Message[],
  newMessage: Message,
  timeDiffThreshold: number = 1000
): boolean {
  return messages.some(
    (m) =>
      m.id === newMessage.id ||
      (m.content === newMessage.content &&
        m.role === newMessage.role &&
        Math.abs(
          new Date(m.created_at).getTime() -
            new Date(newMessage.created_at).getTime()
        ) < timeDiffThreshold)
  );
}

