import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const formData = await request.formData();

  const audioFile = formData.get("file");

  if (!(audioFile instanceof File)) {
    return NextResponse.json(
      { error: "No audio file received." },
      { status: 400 }
    );
  }

  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-large-v3",
    response_format: "verbose_json",
    language: "en",
    temperature: 0,
  });

  return NextResponse.json({
    transcript: transcription.text,
  });
}