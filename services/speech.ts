export interface TranscriptSegment {
  id: string;
  text: string;
  start: number;
  end: number;
}

export interface SpeechResult {
  transcript: TranscriptSegment[];
}

export async function transcribeAudio(
  audio: Blob
): Promise<SpeechResult> {
  const formData = new FormData();

  formData.append("file", audio, "recording.webm");

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

console.log(data);

return {
  transcript: [
    {
      id: crypto.randomUUID(),
      text: data.transcript,
      start: 0,
      end: 0,
    },
  ],
};
}