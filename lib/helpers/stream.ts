export interface StreamChunk {
  content?: string;
  error?: string;
  done?: boolean;
  fullMessage?: string;
}

export interface StreamCallbacks {
  onChunk?: (content: string) => void;
  onComplete?: (fullMessage: string) => void;
  onError?: (error: string) => void;
}

export async function readStreamingResponse(
  response: Response,
  callbacks: StreamCallbacks = {}
): Promise<string> {
  if (!response.body) {
    throw new Error("No response body received from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullMessage = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data: StreamChunk = JSON.parse(line.slice(6));

            if (data.error) {
              if (callbacks.onError) {
                callbacks.onError(data.error);
              }
              throw new Error(data.error);
            }

            if (data.done) {
              fullMessage = data.fullMessage || fullMessage;
              break;
            }

            if (data.content) {
              fullMessage += data.content;
              if (callbacks.onChunk) {
                callbacks.onChunk(data.content);
              }
            }
          } catch (parseError) {
            console.error("Error parsing stream data:", parseError);
          }
        }
      }
    }

    if (!fullMessage) {
      throw new Error("No response from AI");
    }

    if (callbacks.onComplete) {
      callbacks.onComplete(fullMessage);
    }

    return fullMessage;
  } catch (error) {
    if (callbacks.onError && error instanceof Error) {
      callbacks.onError(error.message);
    }
    throw error;
  }
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  characterPrompt: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<Response> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      message,
      characterPrompt,
      conversationHistory,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error:", errorText);
    throw new Error(
      `Failed to get AI response: ${response.status} ${response.statusText}`
    );
  }

  return response;
}

