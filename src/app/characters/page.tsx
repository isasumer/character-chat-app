"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button, Avatar, Card, Skeleton } from "@/components/ui";
import type { Character } from "@/types/database";
import { getCharacterEmoji } from "@/lib/utils";
function CharactersContent() {
  const auth = useAuth();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get character emoji

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .order("name");

        if (error) throw error;
        setCharacters((data as Character[]) || []);
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleStartChat = async (characterId: string) => {
    if (!auth?.user?.id) return;

    try {
      // Create new chat session
      const { data: newSession, error } = await supabase
        .from("chat_sessions")
        // @ts-expect-error - Supabase generated types are incompatible with runtime insert
        .insert({
          user_id: auth.user.id,
          character_id: characterId,
        })
        .select()
        .single();

      if (error) throw error;
      if (newSession) {
        // @ts-expect-error - Supabase type mismatch
        router.push(`/chat/${newSession.id}`);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-20 md:pb-0">
        <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-5xl mx-auto">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64 mb-6" />
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 md:pb-0">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">AI Characters</h1>
          <p className="text-[var(--muted-foreground)]">
            Choose a character to start chatting
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex gap-4 items-start">
                  {/* Avatar */}
                  <Avatar
                    src={character.avatar_url || ""}
                    alt={character.name}
                    fallback={getCharacterEmoji(character.name)}
                    size="lg"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                      {character.name}
                      <span className="text-2xl">
                        {getCharacterEmoji(character.name)}
                      </span>
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">
                      {character.description}
                    </p>
                    {character.personality && (
                      <p className="text-xs text-[var(--muted-foreground)] italic mb-3">
                        {character.personality}
                      </p>
                    )}
                    <Button
                      size="middle"
                      onClick={() => handleStartChat(character.id)}
                      className="w-full sm:w-auto"
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      Start Chatting
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CharactersPage() {
  return (
    <ProtectedRoute>
      <CharactersContent />
    </ProtectedRoute>
  );
}
