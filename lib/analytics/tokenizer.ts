// lib/analytics/tokenizer.ts

/**
 * Removes extra spaces and converts text to lowercase.
 */
export function normalizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Converts text into an array of words.
 *
 * Example:
 * "Hello, World!"
 * ->
 * ["hello", "world"]
 */
export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);

  return normalized.match(/[a-zA-Z']+/g) ?? [];
}

/**
 * Splits a transcript into sentences.
 *
 * Example:
 * "Hi. How are you? I'm good!"
 * ->
 * [
 *   "Hi",
 *   "How are you",
 *   "I'm good"
 * ]
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);
}

/**
 * Counts total words.
 */
export function countWords(text: string): number {
  return tokenize(text).length;
}

/**
 * Counts total characters (excluding leading/trailing spaces).
 */
export function countCharacters(text: string): number {
  return text.trim().length;
}