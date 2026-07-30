export interface RepeatedWord {
  word: string;
  count: number;
}

export interface FillerWord {
  word: string;
  count: number;
}

export interface VocabularyMetrics {
  uniqueWords: number;
  vocabularyRichness: number;
  averageWordLength: number;
  repeatedWords: RepeatedWord[];
}

export interface SentenceMetrics {
  sentenceCount: number;
  averageSentenceLength: number;
  longestSentence: number;
  shortestSentence: number;
}

export interface PaceMetrics {
  durationSeconds: number;
  wordsPerMinute: number;
  speakingPace: "Very Slow" | "Slow" | "Normal" | "Fast" | "Very Fast";
}

export interface FillerMetrics {
  total: number;
  density: number;
  words: FillerWord[];
}
export interface ConfidenceWord {
  word: string;
  count: number;
}

export interface ConfidenceMetrics {
  hesitationWords: ConfidenceWord[];
  confidentWords: ConfidenceWord[];
}

export interface BasicMetrics {
  wordCount: number;
  characterCount: number;
}

/** Reserved for future objective pause analysis. */
export interface PauseMetrics {
  readonly _reserved?: never;
}

/** Reserved for future objective repetition analysis. */
export interface RepetitionMetrics {
  readonly _reserved?: never;
}

export interface SpeechAnalysis {
  basic: BasicMetrics;
  pace: PaceMetrics;
  vocabulary: VocabularyMetrics;
  sentences: SentenceMetrics;
  fillers: FillerMetrics;
  confidence: ConfidenceMetrics;
  pauses?: PauseMetrics;
  repetitions?: RepetitionMetrics;
}
