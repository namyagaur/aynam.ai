import { analyzeFillers } from "./fillers";
import { analyzePace } from "./pace";
import { countCharacters, countWords } from "./tokenizer";
import { SpeechAnalytics } from "./types";
import { analyzeVocabulary } from "./vocabulary";
import { analyzeSentences } from "./sentence";
import { analyzeConfidence } from "./confidence";


export function generateSpeechAnalytics(
  transcript: string,
  durationSeconds: number
): SpeechAnalytics {
  const confidence = analyzeConfidence(transcript);

  const basic = {
    wordCount: countWords(transcript),
    characterCount: countCharacters(transcript),
  };

  const pace = analyzePace(
    transcript,
    durationSeconds
  );

  const vocabulary = analyzeVocabulary(
    transcript
  );

  const fillers = analyzeFillers(
    transcript
  );

  const analyticsSummary =
    `You spoke ${basic.wordCount} words in ${durationSeconds} seconds (${pace.wordsPerMinute} WPM). ` +
    `Your speaking pace was ${pace.speakingPace}. ` +
    `You used ${fillers.total} filler words and your vocabulary richness was ${vocabulary.vocabularyRichness}.`;

  return {
  basic,
  pace,
  vocabulary,
  fillers,
  sentences,
  confidence,
  analyticsSummary,
};
}