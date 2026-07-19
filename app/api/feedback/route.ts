import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {

  const body = await request.json();

  const {
    transcript,
    topic,
    duration,
    difficulty,
  } = body;

  return Response.json({
    transcript,
    topic,
    duration,
    difficulty,
  });

}