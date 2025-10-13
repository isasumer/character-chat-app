"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";
import { Character } from "../../../types/database";

export default function TestDataPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  async function fetchCharacters() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("characters")
        .select("*")
        .order("name");

      if (fetchError) {
        throw fetchError;
      }

      setCharacters(data || []);
    } catch (err) {
      console.error("Error fetching characters:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch characters");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading characters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">❌ Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="bg-white p-4 rounded border border-red-100 text-sm">
            <p className="font-semibold mb-2">Possible issues:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Supabase credentials not set in .env.local</li>
              <li>Database schema not yet created</li>
              <li>Characters not seeded (run seed.sql)</li>
              <li>RLS policies blocking access</li>
            </ul>
          </div>
          <button
            onClick={fetchCharacters}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">⚠️ No Characters Found</h2>
          <p className="text-yellow-700 mb-4">
            The database is connected, but no characters were found.
          </p>
          <div className="bg-white p-4 rounded border border-yellow-100 text-sm text-left">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Go to Supabase SQL Editor</li>
              <li>Run the seed.sql file</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✅ Database Connected Successfully!
          </h1>
          <p className="text-gray-600">
            Found <span className="font-bold text-blue-600">{characters.length}</span> characters in your database
          </p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Avatar */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex items-center justify-center">
                {character.avatar_url ? (
                  <div className="w-24 h-24 rounded-full bg-white p-2 relative">
                    <Image
                      src={character.avatar_url}
                      alt={character.name}
                      width={96}
                      height={96}
                      className="rounded-full"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl">
                    🤖
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {character.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {character.description}
                </p>

                {character.personality && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Personality
                    </span>
                    <p className="text-sm text-gray-700 mt-1">
                      {character.personality}
                    </p>
                  </div>
                )}

                {character.conversation_style && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Style
                    </span>
                    <p className="text-sm text-gray-700 mt-1">
                      {character.conversation_style}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <details className="cursor-pointer">
                    <summary className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      View System Prompt
                    </summary>
                    <p className="text-xs text-gray-600 mt-2 p-3 bg-gray-50 rounded">
                      {character.system_prompt}
                    </p>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Database Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📊 Database Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Characters</p>
              <p className="text-2xl font-bold text-blue-900">{characters.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">Connection</p>
              <p className="text-2xl font-bold text-green-900">✓ Active</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Database</p>
              <p className="text-2xl font-bold text-purple-900">Supabase</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-semibold">Status</p>
              <p className="text-2xl font-bold text-orange-900">Ready</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🚀 Ready for Phase 2!</h3>
          <p className="mb-4">Your database is set up correctly. Next steps:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Delete this test page (src/app/test-data/)</li>
            <li>Set up Google OAuth in Supabase</li>
            <li>Add your Groq API key to .env.local</li>
            <li>Start building the authentication flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

