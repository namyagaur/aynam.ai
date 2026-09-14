import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  cleanupMediaStream,
  createAudioBlob,
  createAudioUrl,
  createMediaRecorder,
  revokeAudioUrl,
  requestMicrophone,
  stopMediaRecorder,
} from "@/services/recorder";
import { RecordingConfig } from "@/config/recording";
import type { RecordingEngineState } from "@/types/recording";

export function useRecordingEngine(totalDurationMinutes: number) {
  const [state, setState] = useState<RecordingEngineState>({
    recordingState: "idle",
    secondsLeft: totalDurationMinutes * 60,
    audioUrl: null,
    audioLevel: 0,
    isSpeaking: false,
    isSilent: true,
    transcript: [],
    error: null,
    isStarting: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingActiveRef = useRef(false);
  const chunkTimerRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const {
    transcript: liveTranscript,
    isListening,
    isSupported: speechRecognitionSupported,
    error: speechRecognitionError,
    start: startSpeechRecognition,
    stop: stopSpeechRecognition,
    reset: resetSpeechRecognition,
    getTranscript: getSpeechTranscript,
    getSpeakingDurationSeconds,
  } = useSpeechRecognition();

  const clearChunkTimer = useCallback(() => {
    if (chunkTimerRef.current) {
      window.clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
  }, []);

  const cleanupResources = useCallback((stopSpeech = true) => {
    recordingActiveRef.current = false;
    clearChunkTimer();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    cleanupMediaStream(streamRef.current);
    streamRef.current = null;
    stopMediaRecorder(mediaRecorderRef.current);
    mediaRecorderRef.current = null;

    if (stopSpeech) {
      void stopSpeechRecognition();
    }
  }, [clearChunkTimer, stopSpeechRecognition]);

  const clearAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      revokeAudioUrl(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const monitorAudioLevel = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) {
      return;
    }

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (const value of dataArray) {
        const normalized = (value - 128) / 128;
        sum += normalized * normalized;
      }
      const average = Math.sqrt(sum / dataArray.length);
      const smoothedLevel = previousLevelRef.current + (average * 1.6 - previousLevelRef.current) * RecordingConfig.audioLevelSmoothing;
      const level = Math.min(1, smoothedLevel);
      const isSpeaking = level > RecordingConfig.silenceThreshold;

      setState((previous) => ({
        ...previous,
        audioLevel: level,
        isSpeaking,
        isSilent: !isSpeaking,
      }));

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const previousLevelRef = useRef(0);

  const createAudioContext = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;
    analyserRef.current = analyser;

    if (streamRef.current) {
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      source.connect(analyser);
      microphoneRef.current = source;
    }
  }, []);

  const startNextChunkRecorder = useCallback(
    (stream: MediaStream) => {
      if (!recordingActiveRef.current) {
        return false;
      }

      const segmentChunks: Blob[] = [];
      const handleRecorderStartError = (error: unknown) => {
        recordingActiveRef.current = false;
        cleanupResources();
        setState((previous) => ({
          ...previous,
          recordingState: "idle",
          isStarting: false,
          error: error instanceof Error ? error.message : "Unable to start audio recording.",
        }));
      };

      let recorder: MediaRecorder;
      try {
        recorder = createMediaRecorder(
          stream,
          (chunk) => {
            if (chunk.size > 0) {
              segmentChunks.push(chunk);
            }
          },
          (error) => {
            setState((previous) => ({ ...previous, error: error.message }));
          }
        );
      } catch (error) {
        handleRecorderStartError(error);
        return false;
      }

      recorder.onstop = () => {
        if (mediaRecorderRef.current === recorder) {
          mediaRecorderRef.current = null;
        }

        const segmentBlob = new Blob(segmentChunks, {
  type: recorder.mimeType || "audio/webm",
});

if (segmentBlob.size < RecordingConfig.minChunkSize) {
  console.log("[recording] skipping tiny chunk", segmentBlob.size);
  return;
}

        if (!recordingActiveRef.current) {
          return;
        }

        if (streamRef.current) {
          // Chromium can emit `stop` before the underlying encoder is fully
          // released. Starting another recorder in the same event turn throws
          // NotSupportedError, so yield briefly before opening the next chunk.
          window.setTimeout(() => {
            if (recordingActiveRef.current && streamRef.current) {
              startNextChunkRecorder(streamRef.current);
            }
          }, 50);
        }
      };

      try {
        recorder.start();
      } catch (error) {
        handleRecorderStartError(error);
        return false;
      }

      mediaRecorderRef.current = recorder;

      clearChunkTimer();
      chunkTimerRef.current = window.setTimeout(() => {
        const activeRecorder = mediaRecorderRef.current;
        if (activeRecorder && activeRecorder.state === "recording") {
          activeRecorder.stop();
        }
      }, RecordingConfig.chunkDurationMs);

      return true;
    },
    [clearChunkTimer, cleanupResources]
  );

  const startRecording = useCallback(async () => {
    if (state.isStarting || state.recordingState === "recording") {
      return;
    }

    setState((previous) => ({ ...previous, isStarting: true, error: null }));

    try {
      clearAudioUrl();
      chunksRef.current = [];
      recordingActiveRef.current = true;

      const stream = await requestMicrophone();
      streamRef.current = stream;
      await createAudioContext();
      recordingStartedAtRef.current = performance.now();
      if (!startNextChunkRecorder(stream)) {
        throw new Error("Unable to start audio recording.");
      }
      resetSpeechRecognition();
      startSpeechRecognition();

      setState((previous) => ({
        ...previous,
        recordingState: "recording",
        secondsLeft: totalDurationMinutes * 60,
        isStarting: false,
        error: null,
      }));

      monitorAudioLevel();
      timerRef.current = window.setInterval(() => {
        setState((previous) => {
          if (previous.recordingState !== "recording") {
            return previous;
          }

          const nextSeconds = Math.max(0, previous.secondsLeft - 1);
          if (nextSeconds === 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            timerRef.current = null;
            return { ...previous, secondsLeft: 0, recordingState: "finished" };
          }

          return { ...previous, secondsLeft: nextSeconds };
        });
      }, 1000);
    } catch (error) {
      cleanupResources();
      setState((previous) => ({
        ...previous,
        recordingState: "idle",
        isStarting: false,
        error: error instanceof Error ? error.message : "Unable to start recording.",
      }));
    }
  }, [clearAudioUrl, cleanupResources, createAudioContext, monitorAudioLevel, resetSpeechRecognition, startNextChunkRecorder, startSpeechRecognition, state.isStarting, state.recordingState, totalDurationMinutes]);

  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      return;
    }

    recorder.pause();
    setState((previous) => ({ ...previous, recordingState: "paused" }));
  }, []);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "paused") {
      return;
    }

    recorder.resume();
    setState((previous) => ({ ...previous, recordingState: "recording" }));
  }, []);

  const finishRecording = useCallback(async () => {
    recordingActiveRef.current = false;
    clearChunkTimer();
    await stopSpeechRecognition();
    const elapsedDurationSeconds = recordingStartedAtRef.current === null
      ? 0
      : Math.max(0, (performance.now() - recordingStartedAtRef.current) / 1000);
    const speakingDurationSeconds = getSpeakingDurationSeconds();
    recordingStartedAtRef.current = null;

    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      cleanupResources();
      setState((previous) => ({ ...previous, recordingState: "finished", isStarting: false }));
      return { transcript: getSpeechTranscript(), elapsedDurationSeconds, speakingDurationSeconds };
    }

    if (recorder.state === "recording" || recorder.state === "paused") {
      const recorderStopped = new Promise<void>((resolve) =>
        recorder.addEventListener("stop", () => resolve(), { once: true })
      );
      recorder.stop();
      await recorderStopped;
    }

    const blob = createAudioBlob(chunksRef.current, recorder.mimeType || undefined);
    if (blob.size > 0) {
      const nextUrl = createAudioUrl(blob);
      audioUrlRef.current = nextUrl;
      setState((previous) => ({ ...previous, audioUrl: nextUrl }));
    }

    cleanupResources(false);
    setState((previous) => ({ ...previous, recordingState: "finished", isStarting: false }));
    return { transcript: getSpeechTranscript(), elapsedDurationSeconds, speakingDurationSeconds };
  }, [cleanupResources, clearChunkTimer, getSpeakingDurationSeconds, getSpeechTranscript, stopSpeechRecognition]);

  const reset = useCallback(() => {
    cleanupResources();
    clearAudioUrl();
    recordingStartedAtRef.current = null;
    resetSpeechRecognition();
    setState({
      recordingState: "idle",
      secondsLeft: totalDurationMinutes * 60,
      audioUrl: null,
      audioLevel: 0,
      isSpeaking: false,
      isSilent: true,
      transcript: [],
      error: null,
      isStarting: false,
    });
  }, [clearAudioUrl, cleanupResources, resetSpeechRecognition, totalDurationMinutes]);

  useEffect(() => {
    return () => {
      cleanupResources();
      clearAudioUrl();
    };
  }, [cleanupResources, clearAudioUrl]);

  return useMemo(() => ({
    ...state,
    liveTranscript,
    speechRecognitionError,
    speechRecognitionSupported,
    isListening,
    startRecording,
    pauseRecording,
    resumeRecording,
    finishRecording,
    reset,
  }), [state, liveTranscript, speechRecognitionError, speechRecognitionSupported, isListening, startRecording, pauseRecording, resumeRecording, finishRecording, reset]);
}
