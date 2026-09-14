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

const SPEECH_INACTIVITY_THRESHOLD_MS = 1000;

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
  const speakingIntervalTimerRef = useRef<number | null>(null);
  const speakingStartedAtRef = useRef<number | null>(null);
  const speakingDurationMsRef = useRef(0);

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

  const closeSpeakingInterval = useCallback((timestamp: number) => {
    if (speakingStartedAtRef.current === null) {
      return;
    }

    speakingDurationMsRef.current += Math.max(0, timestamp - speakingStartedAtRef.current);
    speakingStartedAtRef.current = null;
  }, []);

  const scheduleSpeakingIntervalClose = useCallback(() => {
    if (speakingIntervalTimerRef.current !== null) {
      window.clearTimeout(speakingIntervalTimerRef.current);
    }

    speakingIntervalTimerRef.current = window.setTimeout(() => {
      speakingIntervalTimerRef.current = null;
      closeSpeakingInterval(performance.now());
    }, SPEECH_INACTIVITY_THRESHOLD_MS);
  }, [closeSpeakingInterval]);

  const recordSpeechActivity = useCallback(() => {
    const now = performance.now();
    if (speakingStartedAtRef.current === null) {
      speakingStartedAtRef.current = now;
    }
    scheduleSpeakingIntervalClose();
  }, [scheduleSpeakingIntervalClose]);

  const clearSpeakingIntervalTimer = useCallback(() => {
    if (speakingIntervalTimerRef.current !== null) {
      window.clearTimeout(speakingIntervalTimerRef.current);
      speakingIntervalTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    shouldRestartRef.current = false;
    clearRestartTimer();
    clearSpeakingIntervalTimer();
    closeSpeakingInterval(performance.now());
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
  }, [clearRestartTimer, clearSpeakingIntervalTimer, closeSpeakingInterval, setListening]);

  const reset = useCallback(() => {
    void stop();
    finalPartsRef.current = [];
    speakingStartedAtRef.current = null;
    speakingDurationMsRef.current = 0;
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
        let hasSpeechActivity = false;
        const activityStartIndex = Math.max(0, event.resultIndex);
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const text = result[0]?.transcript ?? "";
          if (result.isFinal) {
            finalPartsRef.current[index] = text;
          } else if (text.trim()) {
            interimParts.push(text);
          }
          if (index >= activityStartIndex) {
            hasSpeechActivity ||= Boolean(text.trim());
          }
        }

        updateTranscript([...finalPartsRef.current, ...interimParts].join(" "));
        if (hasSpeechActivity) {
          recordSpeechActivity();
        }
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
  }, [clearRestartTimer, recordSpeechActivity, setListening, updateTranscript]);

  const getTranscript = useCallback(() => transcriptRef.current, []);
  const getSpeakingDurationSeconds = useCallback(() => {
    const activeDuration = speakingStartedAtRef.current === null
      ? 0
      : Math.max(0, performance.now() - speakingStartedAtRef.current);
    return (speakingDurationMsRef.current + activeDuration) / 1000;
  }, []);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      clearRestartTimer();
      clearSpeakingIntervalTimer();
      closeSpeakingInterval(performance.now());
      try {
        recognitionRef.current?.stop();
      } catch {
        // The recognition may already have ended.
      }
    };
  }, [clearRestartTimer, clearSpeakingIntervalTimer, closeSpeakingInterval]);

  return { transcript, isListening, isSupported, error, start, stop, reset, getTranscript, getSpeakingDurationSeconds };
}