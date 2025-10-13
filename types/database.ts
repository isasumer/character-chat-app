export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          description: string;
          personality: string | null;
          system_prompt: string;
          conversation_style: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          avatar_url?: string | null;
          description: string;
          personality?: string | null;
          system_prompt: string;
          conversation_style?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          description?: string;
          personality?: string | null;
          system_prompt?: string;
          conversation_style?: string | null;
          created_at?: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          character_id: string;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          character_id: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          character_id?: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          chat_session_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_session_id: string;
          role: "user" | "assistant";
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_session_id?: string;
          role?: "user" | "assistant";
          content?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Helper types for easier usage
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Character = Database["public"]["Tables"]["characters"]["Row"];
export type ChatSession = Database["public"]["Tables"]["chat_sessions"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

// Extended types with relations
export type ChatSessionWithCharacter = ChatSession & {
  character: Character;
};

export type ChatSessionWithDetails = ChatSession & {
  character: Character;
  messages: Message[];
};

