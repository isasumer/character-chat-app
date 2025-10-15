import { NextRequest, NextResponse } from "next/server";
import { getChatCompletion } from "../../../../lib/groqClient";

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
    const body: ChatRequest = await request.json();
    const { message, characterPrompt, conversationHistory } = body;

    if (!message || !characterPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare conversation history (limit to last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    const messages = [
      ...recentHistory,
      { role: "user" as const, content: message },
    ];

    // Get AI response from Groq
    const aiResponse = await getChatCompletion(messages, characterPrompt);

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    return NextResponse.json({
      message: aiResponse,
      success: true,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to get AI response",
        success: false,
      },
      { status: 500 }
    );
  }
}

