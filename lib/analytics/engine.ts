import { analyzeFillers } from "./fillers";
import { analyzePace } from "./pace";
import { countCharacters, countWords } from "./tokenizer";
import type { SpeechAnalysis } from "./types";
import { analyzeVocabulary } from "./vocabulary";
import { analyzeSentences } from "./sentence";
import { analyzeConfidence } from "./confidence";

export function generateSpeechAnalytics(
  transcript: string,
  durationSeconds: number,
  speakingDurationSeconds?: number
): SpeechAnalysis {
  const basic = {
    wordCount: countWords(transcript),
    characterCount: countCharacters(transcript),
  };
  const paceDurationSeconds = typeof speakingDurationSeconds === "number" && Number.isFinite(speakingDurationSeconds)
    ? speakingDurationSeconds
    : durationSeconds;

  return {
    basic,
    pace: analyzePace(transcript, paceDurationSeconds),
    vocabulary: analyzeVocabulary(transcript),
    fillers: analyzeFillers(transcript),
    sentences: analyzeSentences(transcript),
    confidence: analyzeConfidence(transcript),
  };
}
