import type { Character, ChatSession } from "../../../types/database";


export interface ChatSessionWithCharacter extends ChatSession {
    characters: Character;
  }
  
  export interface ChatSessionWithLastMessage extends ChatSessionWithCharacter {
    last_message?: {
      content: string;
      created_at: string;
    };
  }
  
  export interface MessageQueryResult {
    content: string;
    created_at: string;
  }
  
  export interface SessionQueryResult extends ChatSession {
    characters: Character;
  }