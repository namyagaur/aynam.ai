export type InsightPeriod = "7 days" | "30 days" | "90 days";

export type InsightSkill = {
  name: string;
  score: number;
  tone: "amber" | "blue" | "green" | "orange" | "violet" | "pink";
};

export type RecentInsightSession = {
  id: string;
  date: string;
  type: string;
  duration: string;
  score: number;
};

export type MockInsights = {
  period: InsightPeriod;
  overall: {
    score: number;
    change: number;
    summary: string;
  };
  progress: Array<{
    label: string;
    score: number;
  }>;
  skills: InsightSkill[];
  strongestSkill: {
    name: string;
    score: number;
    change: number;
    description: string;
  };
  opportunity: {
    name: string;
    score: number;
    description: string;
  };
  patterns: string[];
  recentSessions: RecentInsightSession[];
};

export const mockInsights: MockInsights = {
  period: "30 days",
  overall: {
    score: 84,
    change: 12,
    summary: "Your overall communication score is improving.",
  },
  progress: [
    { label: "Aug 14", score: 68 },
    { label: "Aug 21", score: 71 },
    { label: "Aug 28", score: 72 },
    { label: "Sep 4", score: 77 },
    { label: "Sep 11", score: 84 },
  ],
  skills: [
    { name: "Clarity", score: 82, tone: "violet" },
    { name: "Fluency", score: 74, tone: "blue" },
    { name: "Confidence", score: 88, tone: "green" },
    { name: "Vocabulary", score: 79, tone: "orange" },
    { name: "Structure", score: 71, tone: "violet" },
    { name: "Presence", score: 68, tone: "pink" },
  ],
  strongestSkill: {
    name: "Confidence",
    score: 88,
    change: 14,
    description: "You're sounding more assured and decisive.",
  },
  opportunity: {
    name: "Presence",
    score: 68,
    description: "There's room to make your delivery feel more engaging.",
  },
  patterns: [
    "You use fewer filler words than before.",
    "Your answers are becoming more structured.",
    "You speak more confidently in longer responses.",
    "Your vocabulary is becoming more varied.",
  ],
  recentSessions: [
    { id: "session-today", date: "Today", type: "Interview Practice", duration: "3 min", score: 84 },
    { id: "session-yesterday", date: "Yesterday", type: "Free Practice", duration: "5 min", score: 81 },
    { id: "session-sep-10", date: "Sep 10", type: "Presentation Practice", duration: "4 min", score: 77 },
    { id: "session-sep-08", date: "Sep 8", type: "Free Practice", duration: "3 min", score: 72 },
  ],
};
