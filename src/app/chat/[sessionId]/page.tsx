"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button, Input, Avatar, Skeleton } from "@/components/ui";
import type { Message } from "@/types/database";
import { getCharacterEmoji } from "@/lib/utils";
import type { ChatSessionWithCharacter } from "../../types";

function ChatInterfaceContent() {
  const auth = useAuth();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<ChatSessionWithCharacter | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!auth?.user?.id || !sessionId) return;

    const fetchChatData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: sessionData, error: sessionError } = await supabase
          .from("chat_sessions")
          .select(`
            *,
            characters (*)
          `)
          .eq("id", sessionId)
          .eq("user_id", auth.user?.id || "")
          .single();

        if (sessionError) throw sessionError;
        if (!sessionData) {
          setError("Chat session not found");
          return;
        }

        setSession(sessionData as ChatSessionWithCharacter);

        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_session_id", sessionId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages((messagesData as Message[]) || []);
      } catch (err) {
        console.error("Error fetching chat data:", err);
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatData();

    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chat_session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            setMessages((prev) => [...prev, { ...newMessage, isNew: true }]);
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth?.user?.id, sessionId]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Send message with streaming
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !session || !auth?.user?.id || isSending) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);
    setError(null);
    setStreamingMessage("");

    try {
      // Insert user message
      const { data: userMsg, error: userMsgError } = await supabase
        .from("messages")
        // @ts-expect-error - Supabase insert type mismatch
        .insert({
          chat_session_id: sessionId,
          role: "user",
          content: userMessage,
        })
        .select()
        .single();

      if (userMsgError) throw userMsgError;

      // Add user message to state
      if (userMsg) {
        setMessages((prev) => [...prev, { ...(userMsg as Message), isNew: true }]);
      }

      // Show typing indicator briefly, then start streaming
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 500);

      // Get streaming AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          characterPrompt: session.characters.system_prompt,
          conversationHistory: messages
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Failed to get AI response: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body received from server");
      }

      // Read streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullAiMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }

              if (data.done) {
                fullAiMessage = data.fullMessage || fullAiMessage;
                break;
              }

              if (data.content) {
                fullAiMessage += data.content;
                setStreamingMessage(fullAiMessage);
                // Auto-scroll as message streams
                setTimeout(() => scrollToBottom(), 10);
              }
            } catch (parseError) {
              console.error("Error parsing stream data:", parseError);
            }
          }
        }
      }

      // Clear streaming message
      setStreamingMessage("");

      if (!fullAiMessage) {
        throw new Error("No response from AI");
      }

      // Insert AI message to database
      const { data: aiMsg, error: aiMsgError } = await supabase
        .from("messages")
        // @ts-expect-error - Supabase insert type mismatch
        .insert({
          chat_session_id: sessionId,
          role: "assistant",
          content: fullAiMessage,
        })
        .select()
        .single();

      if (aiMsgError) throw aiMsgError;

      // Add AI message to state
      if (aiMsg) {
        setMessages((prev) => [...prev, { ...(aiMsg as Message), isNew: true }]);
      }

      // Update session updated_at
      await supabase
        .from("chat_sessions")
        // @ts-expect-error - Supabase update type mismatch
        .update({ updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      setStreamingMessage("");
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex gap-2 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              {i % 2 === 0 && <Skeleton className="w-8 h-8 rounded-full" />}
              <Skeleton
                className={`h-16 ${i % 2 === 0 ? "w-2/3" : "w-1/2"} rounded-2xl`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/chat")}>Back to Chats</Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)] w-full">
        <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Button
              shape="circle"
              icon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => router.push("/chat")}
            />

            {/* Character Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar
                  src={session.characters.avatar_url || ""}
                  alt={session.characters.name}
                  fallback={getCharacterEmoji(session.characters.name)}
                  size="md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--background)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-[var(--foreground)]">
                  {session.characters.name} {getCharacterEmoji(session.characters.name)}
                </h2>
                <p className="text-xs text-[var(--muted-foreground)] truncate">
                  {session.characters.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            const isFirstOfType =
              index === 0 || messages[index - 1].role !== message.role;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                }}
                className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* AI Avatar (left side) */}
                {!isUser && isFirstOfType && (
                  <Avatar
                    src={session.characters.avatar_url || ""}
                    alt={session.characters.name}
                    fallback={getCharacterEmoji(session.characters.name)}
                    size="sm"
                    className="mt-1"
                  />
                )}
                {!isUser && !isFirstOfType && <div className="w-8" />}

                {/* Message Bubble */}
                <div
                  className={`
                    max-w-[75%] md:max-w-[65%] rounded-2xl shadow-sm p-2
                    ${
                      isUser
                        ? "bg-[var(--primary)] text-white rounded-br-md"
                        : "bg-[var(--muted)] text-[var(--foreground)] rounded-bl-md"
                    }
                  `}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words ">
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      isUser ? "text-white/70" : "text-[var(--muted-foreground)]"
                    }`}
                  >
                    {formatTimestamp(message.created_at)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Streaming Message */}
        {streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 items-start"
          >
            <Avatar
              src={session.characters.avatar_url || ""}
              alt={session.characters.name}
              fallback={getCharacterEmoji(session.characters.name)}
              size="sm"
              className="mt-1"
            />
            <div className="max-w-[75%] md:max-w-[65%] rounded-2xl rounded-bl-md bg-[var(--muted)] text-[var(--foreground)] shadow-sm p-12px">
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {streamingMessage}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block ml-1 w-2 h-4 bg-[var(--primary)]"
                />
              </p>
            </div>
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 items-center"
          >
            <Avatar
              src={session.characters.avatar_url || ""}
              alt={session.characters.name}
              fallback={getCharacterEmoji(session.characters.name)}
              size="sm"
            />
            <div className="bg-[var(--muted)] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-[var(--muted-foreground)] rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800"
        >
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        </motion.div>
      )}

      {/* Message Input */}
      <div className="sticky bottom-0 bg-[var(--background)] border-t border-[var(--border)] p-4 md:p-6 lg:p-8 w-full">
        <div className="">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${session.characters.name}...`}
              disabled={isSending}
              className="min-h-[48px]"
            />
          </div>
          <Button
            shape="circle"
            size="large"
            icon={
              isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )
            }
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSending}
            className="!h-[48px] !w-[48px]"
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  return (
    <ProtectedRoute>
      <ChatInterfaceContent />
    </ProtectedRoute>
  );
}

