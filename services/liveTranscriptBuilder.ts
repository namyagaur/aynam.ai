import type { TranscriptSegment } from "@/types/transcript";

const NON_SPEECH_ONLY_REGEX = /^[\s\p{P}\p{S}]+$/u;
const MINIMUM_CHARACTER_OVERLAP = 3;

function normalizeForComparison(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase();
}

export function cleanLiveTranscriptChunk(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

export function isValidLiveTranscriptChunk(text: string): boolean {
  const cleaned = cleanLiveTranscriptChunk(text);
  return Boolean(cleaned) && !NON_SPEECH_ONLY_REGEX.test(cleaned);
}

function getWordOverlapLength(previousText: string, incomingText: string): number {
  const previousWords = previousText.split(/\s+/).filter(Boolean);
  const incomingWords = incomingText.split(/\s+/).filter(Boolean);
  const maxOverlap = Math.min(previousWords.length, incomingWords.length);

  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    const previousSlice = normalizeForComparison(previousWords.slice(-overlap).join(" "));
    const incomingSlice = normalizeForComparison(incomingWords.slice(0, overlap).join(" "));

    if (previousSlice && previousSlice === incomingSlice) {
      return overlap;
    }
  }

  return 0;
}

function getCharacterOverlapLength(previousText: string, incomingText: string): number {
  const previous = previousText.toLocaleLowerCase();
  const incoming = incomingText.toLocaleLowerCase();
  const maxOverlap = Math.min(previous.length, incoming.length);

  for (let overlap = maxOverlap; overlap >= MINIMUM_CHARACTER_OVERLAP; overlap -= 1) {
    if (previous.slice(-overlap) === incoming.slice(0, overlap)) {
      return overlap;
    }
  }

  return 0;
}

export function mergeTranscriptChunk(previousText: string, incomingText: string): string {
  const previous = cleanLiveTranscriptChunk(previousText);
  const incoming = cleanLiveTranscriptChunk(incomingText);

  if (!isValidLiveTranscriptChunk(incoming)) {
    return previous;
  }

  if (!previous) {
    return incoming;
  }

  const wordOverlap = getWordOverlapLength(previous, incoming);
  if (wordOverlap > 0) {
    const uniqueIncoming = incoming.split(/\s+/).slice(wordOverlap).join(" ");
    return cleanLiveTranscriptChunk([previous, uniqueIncoming].filter(Boolean).join(" "));
  }

  const characterOverlap = getCharacterOverlapLength(previous, incoming);
  if (characterOverlap > 0) {
    return cleanLiveTranscriptChunk(`${previous}${incoming.slice(characterOverlap)}`);
  }

  return cleanLiveTranscriptChunk(`${previous} ${incoming}`);
}

export class LiveTranscriptBuilder {
  private readonly chunks = new Map<number, string>();
  private transcript = "";
  private isTranscriptDirty = false;

  addChunk(chunkIndex: number, text: string): string {
    if (!this.chunks.has(chunkIndex)) {
      this.updateChunk(chunkIndex, text);
    }

    return this.getTranscript();
  }

  replaceChunk(chunkIndex: number, text: string): string {
    this.updateChunk(chunkIndex, text);
    return this.getTranscript();
  }

  removeChunk(chunkIndex: number): string {
    if (this.chunks.delete(chunkIndex)) {
      this.isTranscriptDirty = true;
    }

    return this.getTranscript();
  }

  getTranscript(): string {
    if (!this.isTranscriptDirty) {
      return this.transcript;
    }

    this.transcript = Array.from(this.chunks.entries())
      .sort(([leftIndex], [rightIndex]) => leftIndex - rightIndex)
      .reduce((mergedTranscript, [, chunk]) => mergeTranscriptChunk(mergedTranscript, chunk), "");
    this.isTranscriptDirty = false;

    return this.transcript;
  }

  reset(): void {
    this.chunks.clear();
    this.transcript = "";
    this.isTranscriptDirty = false;
  }

  private updateChunk(chunkIndex: number, text: string): void {
    const cleaned = cleanLiveTranscriptChunk(text);

    if (isValidLiveTranscriptChunk(cleaned)) {
      this.chunks.set(chunkIndex, cleaned);
    } else {
      this.chunks.delete(chunkIndex);
    }

    this.isTranscriptDirty = true;
  }
}

export function buildLiveTranscriptFromSegments(
  segments: Array<Pick<TranscriptSegment, "text">>
): string {
  const builder = new LiveTranscriptBuilder();
  segments.forEach((segment, index) => builder.addChunk(index, segment.text));
  return builder.getTranscript();
}
