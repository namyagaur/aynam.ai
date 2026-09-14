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

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  return candidates.find((candidate) => {
    try {
      return MediaRecorder.isTypeSupported(candidate);
    } catch {
      return false;
    }
  }) ?? null;
}

export function createMediaRecorder(
  stream: MediaStream,
  onDataAvailable: (blob: Blob) => void,
  onError: (error: Error) => void
): MediaRecorder {
  const mimeType = getSupportedMimeType();
  let recorder: MediaRecorder;
  try {
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  } catch (error) {
    if (!mimeType) {
      throw error;
    }

    recorder = new MediaRecorder(stream);
  }

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
