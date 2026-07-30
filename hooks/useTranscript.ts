import { useCallback, useRef, useState } from "react";
import { createTranscriptStore } from "@/services/transcriptStore";
import type { TranscriptSegment } from "@/types/transcript";

export function useTranscript() {
  const transcriptStoreRef = useRef(createTranscriptStore());
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);

  const syncTranscript = useCallback(() => {
  const next = transcriptStoreRef.current.getSnapshot();

  console.log("STORE:", next);

  setTranscript(
    next.sort(
      (left, right) => (left.chunkIndex ?? 0) - (right.chunkIndex ?? 0)
    )
  );
}, []);

  const getLastText = useCallback(() => {
    const lastSegment = transcript.at(-1);
    return lastSegment?.text ?? "";
  }, [transcript]);

  const appendSegment = useCallback((segment: TranscriptSegment) => {
  transcriptStoreRef.current.appendSegment(segment);
  syncTranscript();
}, [syncTranscript]);

  const replaceSegment = useCallback((segmentId: string, segment: TranscriptSegment) => {
    transcriptStoreRef.current.replaceSegment(segmentId, segment);
    syncTranscript();
  }, [syncTranscript]);

  const reset = useCallback(() => {
    transcriptStoreRef.current.reset();
    setTranscript([]);
  }, []);

  return {
    transcript,
    appendSegment,
    replaceSegment,
    reset,
    getLastText,
  };
}
