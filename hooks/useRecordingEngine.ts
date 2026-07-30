import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { transcribeAudio } from "@/services/transcriber";
import { useTranscript } from "@/hooks/useTranscript";
import { TranscriptionQueue } from "@/services/transcriptionQueue";
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
import type { TranscriptSegment } from "@/types/transcript";

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
  const transcriptionControllerRef = useRef<AbortController | null>(null);
  const transcriptionQueueRef = useRef(new TranscriptionQueue());
  const chunkIndexRef = useRef(0);
  const recordingActiveRef = useRef(false);
  const chunkTimerRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const { liveTranscript, appendSegment, replaceSegment, reset: resetTranscript } = useTranscript();

  const clearChunkTimer = useCallback(() => {
    if (chunkTimerRef.current) {
      window.clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
  }, []);

  const cleanupResources = useCallback(() => {
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

    transcriptionControllerRef.current?.abort();
    transcriptionControllerRef.current = null;
  }, [clearChunkTimer]);

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

  const enqueueChunkTranscription = useCallback(
    (chunk: Blob, start: number, end: number) => {
      const chunkIndex = chunkIndexRef.current + 1;
      chunkIndexRef.current = chunkIndex;
      const pendingSegment: TranscriptSegment = {
        id: `chunk-${chunkIndex}`,
        text: "",
        start,
        end,
        chunkIndex,
        status: "processing",
        provider: "groq",
        createdAt: new Date().toISOString(),
      };

      appendSegment(pendingSegment);

      void transcriptionQueueRef.current.enqueue({
        chunkIndex,
        segment: pendingSegment,
        run: async () => {
          try {
            const result = await transcribeAudio(chunk, {
              start,
              end,
              chunkIndex,
              filename: `chunk-${chunkIndex}.webm`,
              signal: transcriptionControllerRef.current?.signal,
            });
            
            console.log("[recording] transcription result:", result);

            const [segment] = result.transcript;
            if (segment?.text.trim()) {
              console.log("[recording] replacing pending segment", pendingSegment.id);
              replaceSegment(pendingSegment.id, {
                ...segment,
                chunkIndex,
                status: "completed",
                provider: "groq",
                createdAt: pendingSegment.createdAt,
              });
            } else {
              replaceSegment(pendingSegment.id, {
                ...pendingSegment,
                status: "failed",
              });
            }
          } catch (error) {
            replaceSegment(pendingSegment.id, {
              ...pendingSegment,
              status: error instanceof Error && error.name === "AbortError" ? "pending" : "failed",
            });
          }
        },
      });
    },
    [appendSegment, replaceSegment]
  );

  const startNextChunkRecorder = useCallback(
    (stream: MediaStream) => {
      if (!recordingActiveRef.current) {
        return;
      }

      const segmentStartedAt = Math.max(
        0,
        Math.round((Date.now() - (startedAtRef.current ?? Date.now())) / 1000)
      );
      const segmentChunks: Blob[] = [];

      const recorder = createMediaRecorder(
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

      recorder.onstop = () => {
        if (mediaRecorderRef.current === recorder) {
          mediaRecorderRef.current = null;
        }

        const segmentBlob = new Blob(segmentChunks, {
  type: recorder.mimeType || "audio/webm",
});

if (segmentBlob.size < 5000) {
  console.log("[recording] skipping tiny chunk", segmentBlob.size);
  return;
}

enqueueChunkTranscription(
  segmentBlob,
  segmentStartedAt,
  segmentStartedAt + 2
);

        if (!recordingActiveRef.current) {
          return;
        }

        if (streamRef.current) {
          startNextChunkRecorder(streamRef.current);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;

      clearChunkTimer();
      chunkTimerRef.current = window.setTimeout(() => {
        const activeRecorder = mediaRecorderRef.current;
        if (activeRecorder && activeRecorder.state === "recording") {
          activeRecorder.stop();
        }
      }, RecordingConfig.chunkDurationMs);
    },
    [clearChunkTimer, enqueueChunkTranscription]
  );

  const startRecording = useCallback(async () => {
    if (state.isStarting || state.recordingState === "recording") {
      return;
    }

    setState((previous) => ({ ...previous, isStarting: true, error: null }));

    try {
      clearAudioUrl();
      chunksRef.current = [];
      chunkIndexRef.current = 0;
      recordingActiveRef.current = true;
      transcriptionControllerRef.current?.abort();
      transcriptionControllerRef.current = new AbortController();
      startedAtRef.current = Date.now();

      const stream = await requestMicrophone();
      streamRef.current = stream;
      await createAudioContext();
      startNextChunkRecorder(stream);

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
  }, [clearAudioUrl, cleanupResources, createAudioContext, monitorAudioLevel, startNextChunkRecorder, state.isStarting, state.recordingState, totalDurationMinutes]);

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

  const finishRecording = useCallback(() => {
    recordingActiveRef.current = false;
    clearChunkTimer();

    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      cleanupResources();
      setState((previous) => ({ ...previous, recordingState: "finished", isStarting: false }));
      return;
    }

    if (recorder.state === "recording" || recorder.state === "paused") {
      recorder.stop();
    }

    const blob = createAudioBlob(chunksRef.current, recorder.mimeType || undefined);
    if (blob.size > 0) {
      const nextUrl = createAudioUrl(blob);
      audioUrlRef.current = nextUrl;
      setState((previous) => ({ ...previous, audioUrl: nextUrl }));
    }

    cleanupResources();
    setState((previous) => ({ ...previous, recordingState: "finished", isStarting: false }));
  }, [cleanupResources, clearChunkTimer]);

  const reset = useCallback(() => {
    cleanupResources();
    clearAudioUrl();
    resetTranscript();
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
  }, [clearAudioUrl, cleanupResources, resetTranscript, totalDurationMinutes]);

  useEffect(() => {
    return () => {
      cleanupResources();
      clearAudioUrl();
    };
  }, [cleanupResources, clearAudioUrl]);

  return useMemo(() => ({
    ...state,
    liveTranscript,
    startRecording,
    pauseRecording,
    resumeRecording,
    finishRecording,
    reset,
  }), [state, liveTranscript, startRecording, pauseRecording, resumeRecording, finishRecording, reset]);
}
