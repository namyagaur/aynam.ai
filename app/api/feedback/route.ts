import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildFeedbackPrompt } from "@/lib/prompts/feedbackPrompt";
import { generateSpeechAnalytics } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI feedback is not configured." }, { status: 500 });
    }
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
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      // The API key's project no longer has access to Gemini 2.5 Flash.
      // Gemini returned this supported replacement in its 404 response.
      model: "gemini-3.6-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const review = JSON.parse(response.text || "{}");
    return NextResponse.json({
      analytics,
      review,
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
