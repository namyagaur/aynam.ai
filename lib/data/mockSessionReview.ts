export const mockSessionReview = {
  session: {
    durationLabel: "3 min selected",
    userName: "Namya",
    subtitle: "Great job, Namya! Here's your communication breakdown.",
  },
  communicationProfile: {
    clarity: 82,
    fluency: 74,
    confidence: 88,
    vocabulary: 79,
    presence: 68,
    structure: 71,
  },
  highlights: {
    strengths: [
      "You sounded passionate and authentic.",
      "Your ideas were easy to follow.",
      "You used real examples.",
    ],
    improvements: [
      "You jumped between ideas.",
      "You repeated 'like' frequently.",
      "The ending felt abrupt.",
    ],
    understood: [
      "You explained why Aynam exists.",
      "You believe communication can be learned.",
      "You want to help everyone speak better.",
    ],
  },
  pagination: {
    totalPages: 2,
  },
  insights: {
    title: "Let’s make your next session even better.",
    subtitle: "Here are some specific ways to improve, based on what I noticed.",
    rewrite: {
      original: "I was making this thing and then it became better and then I added more and now it’s helping people...",
      suggested: "I started by solving a simple problem. As I understood users better, I added AI to make it more powerful...",
      reason: "Your original version is understandable, but the key idea takes a bit too long to arrive. This version is more direct and easier to follow.",
    },
    fillers: [
      { label: "like", count: 12 },
      { label: "basically", count: 7 },
      { label: "you know", count: 5 },
      { label: "actually", count: 4 },
      { label: "so", count: 3 },
    ],
    quickStats: [
      { label: "Total Words", value: "2,847" },
      { label: "Speaking Time", value: "03:12" },
      { label: "Average Pace", value: "148 WPM" },
      { label: "Sentences", value: "42" },
      { label: "Longest Sentence", value: "24 words" },
    ],
    challenge: "Explain the same idea in under 60 seconds without using filler words.",
  },
};

export type MockSessionReview = typeof mockSessionReview;
export type SessionReviewData = typeof mockSessionReview;

type UnknownRecord = Record<string, unknown>;
const object = (value: unknown): UnknownRecord => value && typeof value === "object" ? value as UnknownRecord : {};
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const score = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : fallback;

export function buildSessionReview(input: unknown): SessionReviewData {
  const payload = object(input);
  const ai = object(payload.review);
  const analytics = object(payload.analytics);
  const pace = object(analytics.pace);
  const sentences = object(analytics.sentences);
  const fillers = object(analytics.fillers);
  const coaching = object(ai.personalizedCoaching);
  const clarity = object(ai.clarity);
  const fluency = object(ai.fluency);
  const confidence = object(ai.confidence);
  const aiVocabulary = object(ai.vocabulary);
  const structure = object(ai.structure);
  const original = typeof payload.transcript === "string" ? payload.transcript : "";
  const durationSeconds = typeof payload.durationSeconds === "number" ? payload.durationSeconds : 0;
  const fillerWords = Array.isArray(fillers.words) ? fillers.words.map(object).map((item) => ({ label: typeof item.word === "string" ? item.word : "filler", count: typeof item.count === "number" ? item.count : 0 })).filter((item) => item.count > 0).slice(0, 5) : [];

  return {
    ...mockSessionReview,
    session: { ...mockSessionReview.session, durationLabel: `${Math.max(1, Math.round(durationSeconds / 60))} min selected` },
    communicationProfile: {
      clarity: score(clarity.score, mockSessionReview.communicationProfile.clarity),
      fluency: score(fluency.score, mockSessionReview.communicationProfile.fluency),
      confidence: score(confidence.score, mockSessionReview.communicationProfile.confidence),
      vocabulary: score(aiVocabulary.score, mockSessionReview.communicationProfile.vocabulary),
      structure: score(structure.score, mockSessionReview.communicationProfile.structure),
      presence: score(confidence.score, mockSessionReview.communicationProfile.presence),
    },
    highlights: {
      strengths: [...strings(clarity.strengths), ...strings(confidence.strengths)].slice(0, 3),
      improvements: [...strings(fluency.improvements), ...strings(clarity.improvements)].slice(0, 3),
      understood: [typeof object(ai.overallAssessment).summary === "string" ? object(ai.overallAssessment).summary : "", typeof coaching.topPriority === "string" ? coaching.topPriority : ""].filter((item): item is string => Boolean(item)),
    },
    insights: {
      ...mockSessionReview.insights,
      rewrite: { original: original.slice(0, 260) || mockSessionReview.insights.rewrite.original, suggested: typeof coaching.example === "string" && coaching.example ? coaching.example : mockSessionReview.insights.rewrite.suggested, reason: typeof coaching.topPriority === "string" && coaching.topPriority ? coaching.topPriority : mockSessionReview.insights.rewrite.reason },
      fillers: fillerWords.length ? fillerWords : mockSessionReview.insights.fillers,
      quickStats: [
        { label: "Total Words", value: String(object(analytics.basic).wordCount ?? 0) },
        { label: "Speaking Time", value: `${String(Math.floor(durationSeconds / 60)).padStart(2, "0")}:${String(durationSeconds % 60).padStart(2, "0")}` },
        { label: "Average Pace", value: `${pace.wordsPerMinute ?? 0} WPM` },
        { label: "Sentences", value: String(sentences.sentenceCount ?? 0) },
        { label: "Longest Sentence", value: `${sentences.longestSentence ?? 0} words` },
      ],
      challenge: typeof coaching.dailyExercise === "string" && coaching.dailyExercise ? coaching.dailyExercise : mockSessionReview.insights.challenge,
    },
  };
}
