export async function requestMicrophone(): Promise<MediaStream> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === "undefined"
  ) {
    throw new Error("Audio recording is not supported in this browser.");
  }

  return navigator.mediaDevices.getUserMedia({ audio: true });
}

export function getSupportedMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? null;
}

export function createMediaRecorder(
  stream: MediaStream,
  onDataAvailable: (blob: Blob) => void,
  onError: (error: Error) => void
): MediaRecorder {
  const mimeType = getSupportedMimeType();
  const options = mimeType ? { mimeType } : undefined;
  const recorder = new MediaRecorder(stream, options);

  recorder.ondataavailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      onDataAvailable(event.data);
    }
  };

  recorder.onerror = () => {
    onError(new Error("The microphone recorder encountered an error."));
  };

  return recorder;
}

export function stopMediaRecorder(recorder: MediaRecorder | null) {
  if (recorder && (recorder.state === "recording" || recorder.state === "paused")) {
    recorder.stop();
  }
}

export function cleanupMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function createAudioBlob(chunks: Blob[], mimeType?: string): Blob {
  return new Blob(chunks, { type: mimeType || "audio/webm" });
}

export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokeAudioUrl(url: string | null) {
  if (!url) {
    return;
  }

  URL.revokeObjectURL(url);
}
