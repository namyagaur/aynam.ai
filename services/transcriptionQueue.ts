import type { TranscriptSegment } from "@/types/transcript";

export interface TranscriptionQueueEntry {
  chunkIndex: number;
  segment: TranscriptSegment;
  run: () => Promise<void>;
}

export class TranscriptionQueue {
  private queue: Promise<void> = Promise.resolve();

  enqueue(entry: TranscriptionQueueEntry) {
    const task = this.queue.then(async () => entry.run()).catch(() => undefined);
    this.queue = task.then(() => undefined);
    return task;
  }
}
