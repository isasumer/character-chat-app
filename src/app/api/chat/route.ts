import { NextRequest } from "next/server";
import { streamChatCompletion } from "../../../../lib/groqClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequest {
  sessionId: string;
  message: string;
  characterPrompt: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

export async function POST(request: NextRequest) {
  try {
    // Check for GROQ_API_KEY
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing API key" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, characterPrompt, conversationHistory } = body;

    if (!message || !characterPrompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: message and characterPrompt are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare conversation history (limit to last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    const messages = [
      ...recentHistory,
      { role: "user" as const, content: message },
    ];

    // Get streaming response from Groq
    const stream = await streamChatCompletion(messages, characterPrompt);

    // Create a ReadableStream to send data to the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let fullMessage = "";
          
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            
            if (content) {
              fullMessage += content;
              // Send each chunk to the client
              const data = JSON.stringify({ 
                content, 
                done: false 
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // Send final message with done flag
          const finalData = JSON.stringify({ 
            content: "", 
            done: true,
            fullMessage 
          });
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage = error instanceof Error ? error.message : "Streaming failed";
          console.error("Error details:", errorMessage);
          const errorData = JSON.stringify({ 
            error: `AI streaming error: ${errorMessage}`,
            done: true 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get AI response";
    console.error("Full error details:", errorMessage);
    
    return new Response(
      JSON.stringify({
        error: `Chat API error: ${errorMessage}`,
        success: false,
        details: error instanceof Error ? error.stack : undefined,
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

