import type { TranscriptSegment } from "@/types/transcript";

export interface TranscriptStore {
  appendSegment: (segment: TranscriptSegment) => void;
  replaceSegment: (segmentId: string, segment: TranscriptSegment) => void;
  mergeOverlap: (segment: TranscriptSegment) => TranscriptSegment;
  trimDuplicates: (segment: TranscriptSegment, previousText: string) => TranscriptSegment;
  sort: () => TranscriptSegment[];
  deduplicate: () => TranscriptSegment[];
  getSnapshot: () => TranscriptSegment[];
  reset: () => void;
}

export function createTranscriptStore(initialSegments: TranscriptSegment[] = []): TranscriptStore {
  let segments = [...initialSegments];

  const cloneSegment = (segment: TranscriptSegment): TranscriptSegment => ({ ...segment });

  const appendSegment = (segment: TranscriptSegment) => {
    segments = [...segments, cloneSegment(segment)];
  };

  const replaceSegment = (segmentId: string, segment: TranscriptSegment) => {
    segments = segments.map((current) => (current.id === segmentId ? cloneSegment(segment) : current));
  };

  const mergeOverlap = (segment: TranscriptSegment): TranscriptSegment => {
    const previous = segments.at(-1);
    if (!previous || !segment.text.trim()) {
      return cloneSegment(segment);
    }

    const previousWords = previous.text.trim().split(/\s+/).filter(Boolean);
    const nextWords = segment.text.trim().split(/\s+/).filter(Boolean);

    if (previousWords.length === 0 || nextWords.length === 0) {
      return cloneSegment(segment);
    }

    const maxOverlap = Math.min(previousWords.length, nextWords.length);

    for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
      const previousSlice = previousWords.slice(-overlap).join(" ");
      const nextSlice = nextWords.slice(0, overlap).join(" ");
      if (previousSlice.toLowerCase() === nextSlice.toLowerCase()) {
        const trimmedText = nextWords.slice(overlap).join(" ").trim();
        return {
          ...cloneSegment(segment),
          text: trimmedText,
        };
      }
    }

    return cloneSegment(segment);
  };

  const trimDuplicates = (segment: TranscriptSegment, previousText: string): TranscriptSegment => {
    if (!segment.text.trim()) {
      return cloneSegment(segment);
    }

    const previousWords = previousText.trim().split(/\s+/).filter(Boolean);
    const nextWords = segment.text.trim().split(/\s+/).filter(Boolean);

    if (previousWords.length === 0 || nextWords.length === 0) {
      return cloneSegment(segment);
    }

    const maxOverlap = Math.min(previousWords.length, nextWords.length);

    for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
      const previousSlice = previousWords.slice(-overlap).join(" ");
      const nextSlice = nextWords.slice(0, overlap).join(" ");
      if (previousSlice.toLowerCase() === nextSlice.toLowerCase()) {
        const trimmedText = nextWords.slice(overlap).join(" ").trim();
        return {
          ...cloneSegment(segment),
          text: trimmedText,
        };
      }
    }

    return cloneSegment(segment);
  };

  const sort = () => [...segments].sort((left, right) => {
    const leftIndex = left.chunkIndex ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = right.chunkIndex ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });

  const deduplicate = () => {
    const ordered = sort();
    return ordered.filter((segment, index) => {
      if (!segment.text.trim()) {
        return false;
      }

      return index === 0 || segment.chunkIndex !== ordered[index - 1].chunkIndex;
    });
  };

  return {
    appendSegment,
    replaceSegment,
    mergeOverlap,
    trimDuplicates,
    sort,
    deduplicate,
    getSnapshot: () => [...segments],
    reset: () => {
      segments = [];
    },
  };
}
