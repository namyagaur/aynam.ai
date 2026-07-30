import { useCallback, useRef, useState } from "react";
import { LiveTranscriptBuilder } from "@/services/liveTranscriptBuilder";
import { createTranscriptStore } from "@/services/transcriptStore";
import type { TranscriptSegment } from "@/types/transcript";

export function useTranscript() {
  const transcriptStoreRef = useRef(createTranscriptStore());
  const liveTranscriptBuilderRef = useRef(new LiveTranscriptBuilder());
  const [liveTranscript, setLiveTranscript] = useState("");

  const appendSegment = useCallback((segment: TranscriptSegment) => {
    transcriptStoreRef.current.appendSegment(segment);
  }, []);

  const replaceSegment = useCallback((segmentId: string, segment: TranscriptSegment) => {
    transcriptStoreRef.current.replaceSegment(segmentId, segment);
    if (segment.status === "completed" && segment.chunkIndex !== undefined) {
      setLiveTranscript(liveTranscriptBuilderRef.current.replaceChunk(segment.chunkIndex, segment.text));
    }
  }, []);

  const reset = useCallback(() => {
    transcriptStoreRef.current.reset();
    liveTranscriptBuilderRef.current.reset();
    setLiveTranscript("");
  }, []);

  return {
    liveTranscript,
    appendSegment,
    replaceSegment,
    reset,
  };
}
