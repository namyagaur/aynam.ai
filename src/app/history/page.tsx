export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-extralight">
          Your Journey
        </h1>

        <p className="mt-3 text-gray-500">
          142 minutes spoken
        </p>

        <div className="mt-12 space-y-4">

          <div className="bg-white rounded-3xl p-6">
            <h2 className="text-xl">
              Storytelling Practice
            </h2>

            <p className="text-gray-500 mt-2">
              8 minutes • Confidence 72
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6">
            <h2 className="text-xl">
              Leadership Practice
            </h2>

            <p className="text-gray-500 mt-2">
              5 minutes • Confidence 81
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}