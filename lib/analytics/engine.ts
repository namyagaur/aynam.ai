import { analyzeFillers } from "./fillers";
import { analyzePace } from "./pace";
import { countCharacters, countWords } from "./tokenizer";
import type { SpeechAnalysis } from "./types";
import { analyzeVocabulary } from "./vocabulary";
import { analyzeSentences } from "./sentence";
import { analyzeConfidence } from "./confidence";

export function generateSpeechAnalytics(
  transcript: string,
  durationSeconds: number
): SpeechAnalysis {
  const basic = {
    wordCount: countWords(transcript),
    characterCount: countCharacters(transcript),
  };

  return {
    basic,
    pace: analyzePace(transcript, durationSeconds),
    vocabulary: analyzeVocabulary(transcript),
    fillers: analyzeFillers(transcript),
    sentences: analyzeSentences(transcript),
    confidence: analyzeConfidence(transcript),
  };
}
