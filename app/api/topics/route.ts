import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const allowedModes = new Set(["public", "conversation", "storytelling", "social", "custom"]);

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_TOPICS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Topic generation is not configured." }, { status: 500 });
  try {
    const body = await request.json();
    const mode = typeof body.mode === "string" && allowedModes.has(body.mode) ? body.mode : "public";
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Create exactly 30 original, specific ${mode} speaking-practice prompts for a 2-5 minute session. Avoid generic prompts such as “Tell me about yourself”. Return exactly this JSON object and no other text: {"topics":["..."]}.`,
      config: { responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(response.text ?? "{}") as { topics?: unknown };
    const topics = Array.isArray(parsed.topics) ? parsed.topics.filter((item): item is string => typeof item === "string").slice(0, 30) : [];
    if (topics.length < 20) throw new Error("Too few topics returned.");
    return NextResponse.json({ topics });
  } catch (error) {
    console.error("[topics] generation failed", error);
    return NextResponse.json({ error: "Unable to create fresh topics right now." }, { status: 500 });
  }
}
