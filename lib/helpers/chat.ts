import { supabase } from "@/lib/supabaseClient";
import type { Message } from "@/types/database";

export interface CreateMessageParams {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}

export async function insertMessage(
  params: CreateMessageParams
): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    // @ts-expect-error - Supabase insert type mismatch
    .insert({
      chat_session_id: params.sessionId,
      role: params.role,
      content: params.content,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function updateSessionTimestamp(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    // @ts-expect-error - Supabase update type mismatch
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function createChatSession(
  userId: string,
  characterId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("chat_sessions")
    // @ts-expect-error - Supabase insert type mismatch
    .insert({
      user_id: userId,
      character_id: characterId,
    })
    .select()
    .single();

  if (error) throw error;
  // @ts-expect-error - Supabase type mismatch
  return data.id;
}

export function formatConversationHistory(
  messages: Message[]
): Array<{ role: string; content: string }> {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

