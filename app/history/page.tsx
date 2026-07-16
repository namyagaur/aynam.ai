"use client";

import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  const sessions = [
    {
      id: 1,
      topic: "Tell me about yourself",
      duration: "10 min",
      score: 8.6,
      date: "Today",
    },
    {
      id: 2,
      topic: "Mock Interview",
      duration: "15 min",
      score: 8.2,
      date: "Yesterday",
    },
    {
      id: 3,
      topic: "Public Speaking",
      duration: "20 min",
      score: 9.0,
      date: "2 days ago",
    },
  ];

  return (
    <main className="min-h-screen bg-[#101726] p-10 text-white">

      <h1 className="text-4xl font-bold">
        Session History
      </h1>

      <p className="mt-3 text-white/60">
        Review your previous speaking sessions.
      </p>

      <div className="mt-10 space-y-5">

        {sessions.map((session) => (

          <div
            key={session.id}
            className="rounded-xl bg-[#1B2233] p-6"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-semibold">
                  {session.topic}
                </h2>

                <p className="mt-2 text-white/60">
                  {session.date} • {session.duration}
                </p>

              </div>

              <div className="text-right">

                <p className="text-white/60">
                  Score
                </p>

                <h2 className="text-3xl font-bold text-sky-400">
                  {session.score}
                </h2>

              </div>

            </div>

            <button
              onClick={() => alert("Detailed feedback coming soon!")}
              className="mt-6 rounded-lg bg-sky-400 px-6 py-3 font-medium text-black"
            >
              View Feedback
            </button>

          </div>

        ))}

      </div>

      <button
        onClick={() => router.push("/practice")}
        className="mt-10 rounded-lg border border-white/20 px-8 py-4"
      >
        Start New Practice
      </button>

    </main>
  );
}