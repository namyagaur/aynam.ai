import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildFeedbackPrompt } from "@/lib/prompts/feedbackPrompt";
import { generateSpeechAnalytics } from "@/lib/analytics";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const {
      transcript,
      durationSeconds,
      topic,
      difficulty,
    } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        {
          error: "Transcript is required",
        },
        {
          status: 400,
        }
      );
    }

    // Generate deterministic analytics
    const analytics = generateSpeechAnalytics(
      transcript,
      durationSeconds
    );

    // Temporary prompt (we'll improve this later)
   const prompt = buildFeedbackPrompt({
  transcript,
  analytics,
  topic,
  difficulty,
});
    const response = await ai.models.generateContent({
model: "gemini-3.5-flash",
      contents: prompt,
    });
console.log(response.text);
    return NextResponse.json({
      analytics,
      response: response.text,
    });

  } catch (error) {
    console.error("Feedback API Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while generating feedback.",
      },
      {
        status: 500,
      }
    );
  }
}