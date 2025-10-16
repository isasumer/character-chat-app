"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/AuthContext";
import { Button, Avatar, Card, Skeleton } from "@/components/ui";
import { getCharacterEmoji } from "@/lib/utils";
import { useGetCharactersQuery } from "@/store/services/chatApi";
import type { Character } from "@/types/database";
import { createChatSession } from "@/lib/helpers";

function CharactersContent() {
  const auth = useAuth();
  const router = useRouter();
  const { data: characters = [], isLoading } = useGetCharactersQuery();

  const handleStartChat = async (characterId: string) => {
    if (!auth?.user?.id) return;

    try {
      const sessionId = await createChatSession(auth.user.id, characterId);
      router.push(`/chat/${sessionId}`);
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
          {characters.map((character: Character, index: number) => (
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
