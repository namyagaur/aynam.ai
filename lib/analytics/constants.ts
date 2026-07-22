// =======================
// Stop Words
// =======================

export const STOP_WORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being",
  "to","of","in","on","for","at","with","and","or","but",
  "i","you","he","she","it","they","we","my","your","our",
  "this","that","these","those","as","by","from",
  "have","has","had","do","does","did",
  "will","would","can","could","should"
]);

// =======================
// Filler Words
// =======================

export const FILLER_WORDS = [
  "um",
  "uh",
  "hmm",
  "erm",
  "like",
  "actually",
  "basically",
  "literally",
  "you know",
  "kind of",
  "sort of",
  "i mean"
];

// =======================
// Confidence Killers
// =======================

export const HESITATION_WORDS = [
  "maybe",
  "probably",
  "i think",
  "i guess",
  "perhaps",
  "not sure"
];

// =======================
// Strong Words
// =======================

export const CONFIDENT_WORDS = [
  "definitely",
  "certainly",
  "implemented",
  "designed",
  "built",
  "created",
  "developed",
  "improved",
  "optimized",
  "led"
];

// =======================
// Transition Words
// =======================

export const TRANSITION_WORDS = [
  "first",
  "firstly",
  "second",
  "secondly",
  "third",
  "however",
  "therefore",
  "moreover",
  "furthermore",
  "finally",
  "overall",
  "in conclusion"
];

// =======================
// Speaking Pace Thresholds
// =======================

export const SPEAKING_PACE = {
  VERY_SLOW: 90,
  SLOW: 110,
  NORMAL: 150,
  FAST: 180,
};