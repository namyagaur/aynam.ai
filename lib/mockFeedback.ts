const mockFeedback = {
  overallAssessment: {
    summary:
      "You communicated your ideas clearly and maintained a calm speaking style. Your vocabulary is good, but reducing filler words and adding more structure will make your responses much stronger."
  },

  confidence: {
    score: 7,
    feedback:
      "You sounded reasonably confident but occasionally softened your statements.",
    strengths: [
      "Used positive language",
      "Maintained a consistent tone"
    ],
    improvements: [
      "Avoid saying 'I think' too often",
      "Use stronger action verbs"
    ]
  },

  clarity: {
    score: 8,
    feedback:
      "Your ideas were understandable and easy to follow.",
    strengths: [
      "Simple sentences",
      "Clear explanations"
    ],
    improvements: [
      "Add more examples"
    ]
  },

  fluency: {
    score: 6,
    feedback:
      "Flow was interrupted by filler words.",
    strengths: [
      "No long pauses"
    ],
    improvements: [
      "Reduce 'um' and 'actually'"
    ]
  },

  grammar: {
    score: 9,
    feedback:
      "Grammar was strong with only minor issues.",
    mistakes: []
  },

  vocabulary: {
    score: 8,
    feedback:
      "Vocabulary is above average.",
    strongWords: [
      "implemented",
      "designed",
      "optimized"
    ],
    overusedWords: [
      "like"
    ]
  },

  structure: {
    score: 6,
    feedback:
      "Try following Introduction → Body → Conclusion."
  },

  personalizedCoaching: {
    topPriority:
      "Reduce filler words.",
    dailyExercise:
      "Speak for 2 minutes on one topic without using fillers.",
    example:
      "Instead of 'I think this project is good', say 'This project improves communication by...'"
  }
};

export default mockFeedback;