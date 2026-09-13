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
