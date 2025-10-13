import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export { groq };

/**
 * Send a message to Groq AI with streaming support
 * @param messages - Array of chat messages
 * @param characterPrompt - System prompt for character personality
 * @returns Streaming response from Groq
 */
export async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  characterPrompt: string
) {
  const stream = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: characterPrompt,
      },
      ...messages,
    ],
    model: "llama-3.3-70b-versatile", // You can also use "gemma2-9b-it" or other models
    temperature: 0.7,
    max_tokens: 1024,
    stream: true,
  });

  return stream;
}

/**
 * Send a message to Groq AI without streaming
 * @param messages - Array of chat messages
 * @param characterPrompt - System prompt for character personality
 * @returns Complete response from Groq
 */
export async function getChatCompletion(
  messages: Array<{ role: string; content: string }>,
  characterPrompt: string
) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: characterPrompt,
      },
      ...messages,
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
    stream: false,
  });

  return completion.choices[0]?.message?.content || "";
}

