export interface SpeechResult {
  transcript: string;
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
  transcript: data.transcript,
};
}