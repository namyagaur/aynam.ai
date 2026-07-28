export interface SpeechResult {
  transcript: string;
}

export async function transcribeAudio(
  audio: Blob
): Promise<SpeechResult> {
  console.log("Received audio:", audio);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    transcript:
      "Hello! This is a dummy transcript coming from speech.ts. If you can read this, the architecture is working correctly.",
  };
}