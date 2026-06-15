export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-extralight">
          Communication Report
        </h1>

        <div className="mt-10 bg-white rounded-3xl p-8">

          <h2 className="text-7xl font-thin text-[#A78BFA]">
            82
          </h2>

          <p className="text-gray-500">
            Confidence Score
          </p>

        </div>

        <div className="mt-6 bg-white rounded-3xl p-8">
          <h3 className="text-xl">
            Strengths
          </h3>

          <ul className="mt-4 space-y-2">
            <li>✓ Strong vocabulary</li>
            <li>✓ Good storytelling</li>
            <li>✓ Clear structure</li>
          </ul>
        </div>

      </div>
    </main>
  );
}