import type { Message } from "@/types/database";
import { insertMessage } from "./chat";
import { sendChatMessage, readStreamingResponse } from "./stream";

export interface MessageHandlerCallbacks {
  onUserMessageSent?: (message: Message) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onStreamStart?: () => void;
  onStreamChunk?: (content: string) => void;
  onStreamComplete?: (message: Message) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

export interface SendMessageParams {
  sessionId: string;
  message: string;
  characterPrompt: string;
  conversationHistory: Array<{ role: string; content: string }>;
}

export class MessageHandler {
  private callbacks: MessageHandlerCallbacks;

  constructor(callbacks: MessageHandlerCallbacks = {}) {
    this.callbacks = callbacks;
  }

  async sendMessage(params: SendMessageParams): Promise<void> {
    const { sessionId, message, characterPrompt, conversationHistory } = params;

    try {
      const userMsg = await insertMessage({
        sessionId,
        role: "user",
        content: message,
      });

      if (this.callbacks.onUserMessageSent) {
        this.callbacks.onUserMessageSent(userMsg);
      }

      // Show typing indicator
      if (this.callbacks.onTypingStart) {
        this.callbacks.onTypingStart();
      }

      // Brief delay for typing indicator
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (this.callbacks.onTypingEnd) {
        this.callbacks.onTypingEnd();
      }

      // Start streaming
      if (this.callbacks.onStreamStart) {
        this.callbacks.onStreamStart();
      }

      // Get streaming AI response
      const response = await sendChatMessage(
        sessionId,
        message,
        characterPrompt,
        conversationHistory
      );

      // Read streaming response
      const fullAiMessage = await readStreamingResponse(response, {
        onChunk: this.callbacks.onStreamChunk,
        onError: this.callbacks.onError,
      });

      // Insert AI message to database
      const aiMsg = await insertMessage({
        sessionId,
        role: "assistant",
        content: fullAiMessage,
      });

      // Notify streaming complete
      if (this.callbacks.onStreamComplete) {
        this.callbacks.onStreamComplete(aiMsg);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      console.error("Error sending message:", err);
      if (this.callbacks.onError) {
        this.callbacks.onError(errorMessage);
      }
      throw err;
    } finally {
      if (this.callbacks.onFinally) {
        this.callbacks.onFinally();
      }
    }
  }

  updateCallbacks(callbacks: Partial<MessageHandlerCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }
}

