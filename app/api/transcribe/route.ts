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
      {
        error: "No audio file received.",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json({
    success: true,
    fileName: audioFile.name,
    fileSize: audioFile.size,
    fileType: audioFile.type,
  });
}