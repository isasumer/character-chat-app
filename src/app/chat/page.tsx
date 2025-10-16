"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Search, Sparkles, Clock } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Button,
  Input,
  Avatar,
  EmptyState,
  Skeleton,
  Card,
} from "@/components/ui";
import type { Character } from "@/types/database";
import type {
  ChatSessionWithLastMessage,
  SessionQueryResult,
  MessageQueryResult,
} from "../types";

import { getCharacterEmoji } from "@/lib/utils";

function ChatListContent() {
  const auth = useAuth();
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<
    ChatSessionWithLastMessage[]
  >([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

  // Fetch chat sessions and characters
  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all characters
        const { data: charactersData, error: charactersError } = await supabase
          .from("characters")
          .select("*")
          .order("name");

        if (charactersError) throw charactersError;
        setCharacters((charactersData as Character[]) || []);

        // Fetch user's chat sessions with character info
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("chat_sessions")
          .select(
            `
            *,
            characters (*)
          `
          )
          .eq("user_id", auth.user?.id || "")
          .order("updated_at", { ascending: false });

        if (sessionsError) throw sessionsError;

        // Fetch last message for each session
        const sessionsWithMessages = await Promise.all(
          ((sessionsData as SessionQueryResult[]) || []).map(
            async (session: SessionQueryResult) => {
              const { data: lastMessage } = await supabase
                .from("messages")
                .select("content, created_at")
                .eq("chat_session_id", session.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

              return {
                ...session,
                last_message: lastMessage
                  ? {
                      content: (lastMessage as MessageQueryResult).content,
                      created_at: (lastMessage as MessageQueryResult)
                        .created_at,
                    }
                  : undefined,
              } as ChatSessionWithLastMessage;
            }
          )
        );

        setChatSessions(sessionsWithMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates for chat sessions
    const channel = supabase
      .channel("chat_sessions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_sessions",
          filter: `user_id=eq.${auth.user.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auth?.user]);

  // Create new chat session
  const handleStartChat = async (characterId: string) => {
    if (!auth?.user?.id) return;

    try {
      // Supabase insert types are overly strict, using type assertion
      const result = await supabase
        .from("chat_sessions")
        // @ts-expect-error - Supabase generated types are incompatible with runtime insert
        .insert({
          user_id: auth.user.id,
          character_id: characterId,
        })
        .select()
        .single();

      const { data: newSession, error } = result;

      if (error) throw error;
      if (newSession) {
        // @ts-expect-error - Supabase type mismatch
        router.push(`/chat/${newSession.id}`);
      }
    } catch (error) {
      console.error("Error creating chat session:", error);
    }
  };

  // Filter chat sessions based on search
  const filteredSessions = chatSessions.filter((session) =>
    session.characters.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)]">
          <div className="px-4 py-4">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Chat Sessions Skeleton */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-4 max-w-4xl mx-auto">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-8 py-4 md:py-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <h1 className="text-2xl font-bold">Chats</h1>
            <Button
              shape="circle"
              icon={<Plus className="w-5 h-5" />}
              onClick={() => setShowCharacterSelect(true)}
            />
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <Input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Sessions List */}
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {filteredSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <EmptyState
              icon={MessageSquare}
              title="No chats yet"
              description="Start a conversation with one of our AI characters"
              action={
                <Button
                  onClick={() => setShowCharacterSelect(true)}
                  size="large"
                  className="mt-4"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Start New Chat
                </Button>
              }
            />
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/chat/${session.id}`)}
                >
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] active:transition-transform">
                    <div className="flex gap-3">
                      {/* Character Avatar */}
                      <div className="relative">
                        <Avatar
                          src={session.characters.avatar_url || ""}
                          alt={session.characters.name}
                          fallback={getCharacterEmoji(session.characters.name)}
                          size="md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[var(--background)]" />
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {session.characters.name}
                          </h3>
                          {session.last_message && (
                            <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(session.last_message.created_at)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] truncate">
                          {session.last_message?.content ||
                            session.characters.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Character Selection Modal */}
      <AnimatePresence>
        {showCharacterSelect && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCharacterSelect(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 max-w-md w-full mx-auto bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--border)] z-50 max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Choose a Character</h2>
                  <button
                    onClick={() => setShowCharacterSelect(false)}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Start a conversation with an AI personality
                </p>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  {characters.map((character, index) => (
                    <motion.div
                      key={character.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        handleStartChat(character.id);
                        setShowCharacterSelect(false);
                      }}
                    >
                      <Card className="p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
                        <div className="flex gap-3">
                          <Avatar
                            src={character.avatar_url || ""}
                            alt={character.name}
                            fallback={getCharacterEmoji(character.name)}
                            size="md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--foreground)] mb-1">
                              {character.name}{" "}
                              {getCharacterEmoji(character.name)}
                            </h3>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {character.description}
                            </p>
                          </div>
                          <Sparkles className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Chat() {
  return (
    <ProtectedRoute>
      <ChatListContent />
    </ProtectedRoute>
  );
}
