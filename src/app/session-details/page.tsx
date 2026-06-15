export default function SessionDetailsPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-extralight">
          Difficult Decision Story
        </h1>

        <p className="mt-3 text-gray-500">
          8 June 2026 • 8 Minutes
        </p>

        <div className="mt-10 bg-white rounded-3xl p-8">

          <h2 className="text-sm text-gray-400">
            Topic
          </h2>

          <p className="mt-3 text-xl">
            Tell a story about a difficult decision.
          </p>

        </div>

        <div className="mt-6 bg-white rounded-3xl p-8">

          <h2 className="text-sm text-gray-400">
            Transcript
          </h2>

          <p className="mt-4 text-gray-700">
            Lorem ipsum transcript goes here...
          </p>

        </div>

      </div>
    </main>
  );
}