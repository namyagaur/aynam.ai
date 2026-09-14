import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  [index: number]: { transcript: string };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
};

type SpeechRecognitionErrorEventLike = Event & {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as SpeechRecognitionWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function getErrorMessage(error: string): string {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "Microphone permission is required for live transcription.";
  }

  if (error === "audio-capture") {
    return "Live transcription could not access the microphone.";
  }

  return "Live transcription is temporarily unavailable. Your recording will continue.";
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalPartsRef = useRef<string[]>([]);
  const transcriptRef = useRef("");
  const isListeningRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);

  const updateTranscript = useCallback((nextTranscript: string) => {
    const normalized = nextTranscript.replace(/\s+/g, " ").trim();
    transcriptRef.current = normalized;
    setTranscript(normalized);
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const setListening = useCallback((nextIsListening: boolean) => {
    isListeningRef.current = nextIsListening;
    setIsListening(nextIsListening);
  }, []);

  const stop = useCallback(() => {
    shouldRestartRef.current = false;
    clearRestartTimer();
    const recognition = recognitionRef.current;

    if (!recognition || !isListeningRef.current) {
      setListening(false);
      return Promise.resolve(transcriptRef.current);
    }

    return new Promise<string>((resolve) => {
      const previousOnEnd = recognition.onend;
      recognition.onend = () => {
        previousOnEnd?.();
        recognition.onend = previousOnEnd;
        setListening(false);
        resolve(transcriptRef.current);
      };

      try {
        recognition.stop();
      } catch {
        setListening(false);
        resolve(transcriptRef.current);
      }
    });
  }, [clearRestartTimer, setListening]);

  const reset = useCallback(() => {
    void stop();
    finalPartsRef.current = [];
    updateTranscript("");
    setError(null);
  }, [stop, updateTranscript]);

  const start = useCallback(() => {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      setIsSupported(false);
      setError("Live transcription isn't supported in this browser.");
      return;
    }

    setIsSupported(true);
    setError(null);
    shouldRestartRef.current = true;
    clearRestartTimer();

    if (!recognitionRef.current) {
      const recognition = new Recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const interimParts: string[] = [];
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const text = result[0]?.transcript ?? "";
          if (result.isFinal) {
            finalPartsRef.current[index] = text;
          } else if (text.trim()) {
            interimParts.push(text);
          }
        }

        updateTranscript([...finalPartsRef.current, ...interimParts].join(" "));
        setError(null);
      };

      recognition.onerror = (event) => {
        const isPermissionError = event.error === "not-allowed" || event.error === "service-not-allowed";
        if (isPermissionError) {
          shouldRestartRef.current = false;
        }
        setError(getErrorMessage(event.error));
      };

      recognition.onend = () => {
        setListening(false);
        if (!shouldRestartRef.current) {
          return;
        }

        restartTimerRef.current = window.setTimeout(() => {
          if (!shouldRestartRef.current || !recognitionRef.current) {
            return;
          }

          try {
            recognitionRef.current.start();
            setListening(true);
          } catch {
            setError("Live transcription is temporarily unavailable. Your recording will continue.");
          }
        }, 100);
      };

      recognitionRef.current = recognition;
    }

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setError("Live transcription is temporarily unavailable. Your recording will continue.");
    }
  }, [clearRestartTimer, setListening, updateTranscript]);

  const getTranscript = useCallback(() => transcriptRef.current, []);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      clearRestartTimer();
      try {
        recognitionRef.current?.stop();
      } catch {
        // The recognition may already have ended.
      }
    };
  }, [clearRestartTimer]);

  return { transcript, isListening, isSupported, error, start, stop, reset, getTranscript };
}