"use client";

import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();

  const feedback = {
    confidence: 8.4,
    grammar: 9.1,
    clarity: 8.8,
    vocabulary: 8.2,
    fillers: 7.5,
    summary:
      "You spoke confidently with good clarity. Try reducing filler words and slowing your pace for an even stronger delivery.",
  };

  return (
<main className="min-h-screen bg-[#101726] p-10 text-white">
      <h1 className="text-4xl font-bold">
        Session Feedback
      </h1>

      <p className="mt-3 text-white/60">
        Here's how you performed in this practice session.
      </p>

      {/* Scores */}

      <div className="mt-10 grid grid-cols-2 gap-6">

        <ScoreCard
          title="Confidence"
          score={feedback.confidence}
        />

        <ScoreCard
          title="Grammar"
          score={feedback.grammar}
        />

        <ScoreCard
          title="Clarity"
          score={feedback.clarity}
        />

        <ScoreCard
          title="Vocabulary"
          score={feedback.vocabulary}
        />

        <ScoreCard
          title="Fillers"
          score={feedback.fillers}
        />

      </div>

      {/* Summary */}

      <div className="mt-10 rounded-xl bg-[#1B2233] p-6">

        <h2 className="text-2xl font-semibold">
          AI Summary
        </h2>

        <p className="mt-4 text-white/70 leading-8">
          {feedback.summary}
        </p>

      </div>

      {/* Continue */}

      <button
        onClick={() => router.push("/history")}
        className="mt-10 rounded-lg bg-sky-400 px-8 py-4 font-semibold text-black"
      >
        View History
      </button>
    </main>
  );
}

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="rounded-xl bg-[#1B2233] p-6">

      <p className="text-white/60">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold">
        {score}
      </h2>

    </div>
    
  );
}