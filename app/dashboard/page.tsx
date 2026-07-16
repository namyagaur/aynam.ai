import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  const user = {
    name: "Namya",
    streak: 12,
    averageScore: 8.6,
  };

  const recentSessions = [
    {
      title: "Tell me about yourself",
      score: 8.7,
      date: "Yesterday",
    },
    {
      title: "Mock Interview",
      score: 8.3,
      date: "2 days ago",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#101726]">

      <Sidebar />

      <main className="flex-1 p-10">

        <h1 className="text-5xl font-semibold text-white">
          Good Evening, {user.name} 👋
        </h1>

        <p className="mt-3 text-white/60">
          Ready to continue becoming a better communicator?
        </p>

        {/* Continue Practice */}

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8">

          <p className="text-white/50">
            Continue Practice
          </p>

          <h2 className="mt-2 text-3xl text-white">
            Tell me about yourself.
          </h2>

          <p className="mt-2 text-white/50">
            Estimated Time • 8 min
          </p>

          <Link href="/practice">

            <button className="mt-8 rounded-xl bg-sky-400 px-8 py-4 font-medium text-black">

              Continue →

            </button>

          </Link>

        </div>

        {/* Stats */}

        <div className="mt-10 grid grid-cols-3 gap-6">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <p className="text-white/50">
              Current Streak
            </p>

            <h2 className="mt-3 text-4xl text-white">
              🔥 {user.streak}
            </h2>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <p className="text-white/50">
              Sessions
            </p>

            <h2 className="mt-3 text-4xl text-white">
              47
            </h2>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <p className="text-white/50">
              Average Score
            </p>

            <h2 className="mt-3 text-4xl text-white">
              {user.averageScore}
            </h2>

          </div>

        </div>

        {/* Recent Sessions */}

        <div className="mt-12">

          <h2 className="mb-6 text-2xl text-white">

            Recent Sessions

          </h2>

          <div className="space-y-4">

            {recentSessions.map((session) => (

              <div
                key={session.title}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
              >

                <div>

                  <h3 className="text-white">

                    {session.title}

                  </h3>

                  <p className="text-white/50">

                    {session.date}

                  </p>

                </div>

                <div className="text-sky-300 text-xl font-semibold">

                  {session.score}

                </div>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}
