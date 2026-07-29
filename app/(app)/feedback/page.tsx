"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FeedbackState = {
  overallAssessment: { summary: string };
  confidence: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  clarity: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  fluency: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  grammar: { score: number; feedback: string; strengths: string[]; improvements: string[]; mistakes: string[] };
  vocabulary: { score: number; feedback: string; strengths: string[]; improvements: string[]; strongWords: string[]; overusedWords: string[] };
  structure: { score: number; feedback: string; strengths: string[]; improvements: string[] };
  personalizedCoaching: { topPriority: string; dailyExercise: string; example: string };
};

function createDefaultFeedback(): FeedbackState {
  return {
    overallAssessment: { summary: "No feedback available yet." },
    confidence: { score: 0, feedback: "", strengths: [], improvements: [] },
    clarity: { score: 0, feedback: "", strengths: [], improvements: [] },
    fluency: { score: 0, feedback: "", strengths: [], improvements: [] },
    grammar: { score: 0, feedback: "", strengths: [], improvements: [], mistakes: [] },
    vocabulary: { score: 0, feedback: "", strengths: [], improvements: [], strongWords: [], overusedWords: [] },
    structure: { score: 0, feedback: "", strengths: [], improvements: [] },
    personalizedCoaching: { topPriority: "", dailyExercise: "", example: "" },
  };
}

function normalizeFeedback(value: unknown): FeedbackState {
  const fallback = createDefaultFeedback();
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const parsed = value as Partial<FeedbackState>;
  return {
    overallAssessment: {
      summary: parsed?.overallAssessment?.summary ?? fallback.overallAssessment.summary,
    },
    confidence: {
      score: parsed?.confidence?.score ?? fallback.confidence.score,
      feedback: parsed?.confidence?.feedback ?? fallback.confidence.feedback,
      strengths: parsed?.confidence?.strengths ?? fallback.confidence.strengths,
      improvements: parsed?.confidence?.improvements ?? fallback.confidence.improvements,
    },
    clarity: {
      score: parsed?.clarity?.score ?? fallback.clarity.score,
      feedback: parsed?.clarity?.feedback ?? fallback.clarity.feedback,
      strengths: parsed?.clarity?.strengths ?? fallback.clarity.strengths,
      improvements: parsed?.clarity?.improvements ?? fallback.clarity.improvements,
    },
    fluency: {
      score: parsed?.fluency?.score ?? fallback.fluency.score,
      feedback: parsed?.fluency?.feedback ?? fallback.fluency.feedback,
      strengths: parsed?.fluency?.strengths ?? fallback.fluency.strengths,
      improvements: parsed?.fluency?.improvements ?? fallback.fluency.improvements,
    },
    grammar: {
      score: parsed?.grammar?.score ?? fallback.grammar.score,
      feedback: parsed?.grammar?.feedback ?? fallback.grammar.feedback,
      strengths: parsed?.grammar?.strengths ?? fallback.grammar.strengths,
      improvements: parsed?.grammar?.improvements ?? fallback.grammar.improvements,
      mistakes: parsed?.grammar?.mistakes ?? fallback.grammar.mistakes,
    },
    vocabulary: {
      score: parsed?.vocabulary?.score ?? fallback.vocabulary.score,
      feedback: parsed?.vocabulary?.feedback ?? fallback.vocabulary.feedback,
      strengths: parsed?.vocabulary?.strengths ?? fallback.vocabulary.strengths,
      improvements: parsed?.vocabulary?.improvements ?? fallback.vocabulary.improvements,
      strongWords: parsed?.vocabulary?.strongWords ?? fallback.vocabulary.strongWords,
      overusedWords: parsed?.vocabulary?.overusedWords ?? fallback.vocabulary.overusedWords,
    },
    structure: {
      score: parsed?.structure?.score ?? fallback.structure.score,
      feedback: parsed?.structure?.feedback ?? fallback.structure.feedback,
      strengths: parsed?.structure?.strengths ?? fallback.structure.strengths,
      improvements: parsed?.structure?.improvements ?? fallback.structure.improvements,
    },
    personalizedCoaching: {
      topPriority: parsed?.personalizedCoaching?.topPriority ?? fallback.personalizedCoaching.topPriority,
      dailyExercise: parsed?.personalizedCoaching?.dailyExercise ?? fallback.personalizedCoaching.dailyExercise,
      example: parsed?.personalizedCoaching?.example ?? fallback.personalizedCoaching.example,
    },
  };
}

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback] = useState<FeedbackState>(() => {
    if (typeof window === "undefined") {
      return createDefaultFeedback();
    }

    try {
      const stored = window.sessionStorage.getItem("feedback");
      if (!stored) {
        return createDefaultFeedback();
      }

      return normalizeFeedback(JSON.parse(stored));
    } catch {
      return createDefaultFeedback();
    }
  });
  return (
    <main className="min-h-screen bg-[#101726] text-white">
      <div className="mx-auto max-w-6xl px-8 py-12">

        {/* Header */}

        <h1 className="text-5xl font-bold">
          Session Feedback
        </h1>

        <p className="mt-4 text-lg text-white/60">
          Here&apos;s your personalized communication report.
        </p>

        {/* Overall */}

        <div className="mt-10 rounded-2xl bg-[#1B2233] p-8">

          <p className="text-sm uppercase tracking-widest text-sky-400">
            Overall Assessment
          </p>

          <p className="mt-5 text-lg leading-8 text-white/80">
            {feedback.overallAssessment.summary}
          </p>

        </div>

        {/* Score Cards */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          <ScoreCard
            title="Confidence"
            score={feedback.confidence.score}
            feedback={feedback.confidence.feedback}
          />

          <ScoreCard
            title="Clarity"
            score={feedback.clarity.score}
            feedback={feedback.clarity.feedback}
          />

          <ScoreCard
            title="Fluency"
            score={feedback.fluency.score}
            feedback={feedback.fluency.feedback}
          />

          <ScoreCard
            title="Grammar"
            score={feedback.grammar.score}
            feedback={feedback.grammar.feedback}
          />

          <ScoreCard
            title="Vocabulary"
            score={feedback.vocabulary.score}
            feedback={feedback.vocabulary.feedback}
          />

          <ScoreCard
            title="Structure"
            score={feedback.structure.score}
            feedback={feedback.structure.feedback}
          />

        </div>

        {/* Confidence */}

        <SectionCard
          title="Confidence"
          strengths={feedback.confidence.strengths}
          improvements={feedback.confidence.improvements}
        />

        {/* Clarity */}

        <SectionCard
          title="Clarity"
          strengths={feedback.clarity.strengths}
          improvements={feedback.clarity.improvements}
        />

        {/* Fluency */}

        <SectionCard
          title="Fluency"
          strengths={feedback.fluency.strengths}
          improvements={feedback.fluency.improvements}
        />

        {/* Vocabulary */}

        <div className="mt-10 rounded-2xl bg-[#1B2233] p-8">

          <h2 className="text-2xl font-semibold">
            Vocabulary
          </h2>

          <div className="mt-6">

            <p className="font-semibold text-green-400">
              Strong Words
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">

              {feedback.vocabulary.strongWords.map((word: string) => (
                <li key={word}>{word}</li>
              ))}

            </ul>

          </div>

          <div className="mt-8">

            <p className="font-semibold text-red-400">
              Overused Words
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">

              {feedback.vocabulary.overusedWords.map((word: string) => (
                <li key={word}>{word}</li>
              ))}

            </ul>

          </div>

        </div>
                {/* Grammar */}

        <div className="mt-10 rounded-2xl bg-[#1B2233] p-8">

          <h2 className="text-2xl font-semibold">
            Grammar
          </h2>

          <p className="mt-4 text-white/70">
            {feedback.grammar.feedback}
          </p>

          {feedback.grammar.mistakes.length > 0 && (
            <>
              <h3 className="mt-6 font-semibold text-red-400">
                Mistakes
              </h3>

              <ul className="mt-3 list-disc space-y-2 pl-6">

                {feedback.grammar.mistakes.map((mistake: string) => (
                  <li key={mistake}>{mistake}</li>
                ))}

              </ul>
            </>
          )}

        </div>

        {/* Personalized Coach */}

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 p-[1px]">

          <div className="rounded-2xl bg-[#101726] p-8">

            <h2 className="text-3xl font-bold">
              🎯 Your AI Coach
            </h2>

            <div className="mt-8 space-y-8">

              <div>

                <h3 className="text-lg font-semibold text-sky-400">
                  Top Priority
                </h3>

                <p className="mt-2 text-white/80">
                  {feedback.personalizedCoaching.topPriority}
                </p>

              </div>

              <div>

                <h3 className="text-lg font-semibold text-sky-400">
                  Daily Exercise
                </h3>

                <p className="mt-2 text-white/80">
                  {feedback.personalizedCoaching.dailyExercise}
                </p>

              </div>

              <div>

                <h3 className="text-lg font-semibold text-sky-400">
                  Example
                </h3>

                <p className="mt-2 text-white/80 italic">
                  {feedback.personalizedCoaching.example}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-12 flex gap-5">

          <button
            onClick={() => router.push("/practice")}
            className="rounded-xl bg-sky-400 px-8 py-4 font-semibold text-black transition hover:scale-105"
          >
            Practice Again
          </button>

          <button
            onClick={() => router.push("/history")}
            className="rounded-xl border border-white/20 px-8 py-4 font-semibold transition hover:bg-white/10"
          >
            View History
          </button>

        </div>

      </div>
    </main>
  );
}

function ScoreCard({
  title,
  score,
  feedback,
}: {
  title: string;
  score: number;
  feedback: string;
}) {
  return (
    <div className="rounded-2xl bg-[#1B2233] p-6">

      <p className="text-white/60">
        {title}
      </p>

      <h2 className="mt-3 text-5xl font-bold">
        {score}
        <span className="text-xl text-white/40">/10</span>
      </h2>

      <p className="mt-4 text-sm leading-7 text-white/70">
        {feedback}
      </p>

    </div>
  );
}

function SectionCard({
  title,
  strengths,
  improvements,
}: {
  title: string;
  strengths: string[];
  improvements: string[];
}) {
  return (
    <div className="mt-10 rounded-2xl bg-[#1B2233] p-8">

      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      <div className="mt-8 grid gap-8 md:grid-cols-2">

        <div>

          <h3 className="font-semibold text-green-400">
            ✅ Strengths
          </h3>

          <ul className="mt-4 list-disc space-y-2 pl-6">

            {strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}

          </ul>

        </div>

        <div>

          <h3 className="font-semibold text-red-400">
            ⚠ Improvements
          </h3>

          <ul className="mt-4 list-disc space-y-2 pl-6">

            {improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}

          </ul>

        </div>

      </div>

    </div>
  );
}