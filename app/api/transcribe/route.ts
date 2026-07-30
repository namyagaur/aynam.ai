import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    console.error("[transcribe] invalid request content type", { contentType });
    return NextResponse.json(
      {
        error: `Expected multipart/form-data request, received ${contentType || "unknown"}`,
      },
      { status: 400 }
    );
  }

  if (!contentType.includes("boundary=")) {
    console.error("[transcribe] multipart request missing boundary", { contentType });
    return NextResponse.json(
      { error: "Multipart request is missing a boundary parameter." },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("file");

    if (!(audioFile instanceof File)) {
      console.error("[transcribe] no audio file received", { contentType });
      return NextResponse.json(
        { error: "No audio file received." },
        { status: 400 }
      );
    }

    console.info("[transcribe] received upload", {
      contentType,
      fileName: audioFile.name,
      fileType: audioFile.type,
      fileSize: audioFile.size,
    });

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "verbose_json",
      language: "en",
      temperature: 0,
    });
    console.log("Groq returned:", transcription);
console.log("Groq text:", transcription.text);

    return NextResponse.json({
      transcript: transcription.text,
    });
  } catch (error) {
    console.error("[transcribe] failed to parse multipart body", {
      contentType,
      error,
    });

    return NextResponse.json(
      { error: "Failed to parse multipart form-data body." },
      { status: 400 }
    );
  }
}
