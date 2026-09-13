import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[transcribe] GROQ_API_KEY is not configured");
    return NextResponse.json(
      { error: "Live transcription is not configured. Add GROQ_API_KEY to your environment." },
      { status: 500 }
    );
  }

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

    const groq = new Groq({ apiKey });
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
  } catch (error) {
    console.error("[transcribe] request failed", {
      contentType,
      error,
    });

    const message = error instanceof Error ? error.message : "Unable to transcribe audio.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
