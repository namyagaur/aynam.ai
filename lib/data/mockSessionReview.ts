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
    currentPage: 1,
    totalPages: 2,
  },
};

export type MockSessionReview = typeof mockSessionReview;