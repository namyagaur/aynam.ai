export default function SessionDetailsPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF8] px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
            Session Details
          </p>

          <h1 className="mt-4 text-5xl font-extralight tracking-tight">
            Difficult Decision Story
          </h1>

          <p className="mt-3 text-gray-500">
            8 June 2026 • 8 Minutes
          </p>
        </div>

        {/* Topic */}
        <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm">
          <p className="text-sm text-gray-400">
            Topic
          </p>

          <h2 className="mt-3 text-2xl font-light">
            Tell a story about a difficult decision.
          </h2>
        </div>

        {/* Metrics */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Performance Metrics
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            <div className="rounded-2xl bg-[#F7F4FF] p-5">
              <p className="text-sm text-gray-500">
                Confidence
              </p>

              <h3 className="mt-2 text-4xl font-light">
                82
              </h3>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-5">
              <p className="text-sm text-gray-500">
                Clarity
              </p>

              <h3 className="mt-2 text-4xl font-light">
                79
              </h3>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-5">
              <p className="text-sm text-gray-500">
                Grammar
              </p>

              <h3 className="mt-2 text-4xl font-light">
                88
              </h3>
            </div>

            <div className="rounded-2xl bg-[#F7F4FF] p-5">
              <p className="text-sm text-gray-500">
                Vocabulary
              </p>

              <h3 className="mt-2 text-4xl font-light">
                75
              </h3>
            </div>

          </div>
        </div>

        {/* Transcript */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Transcript
          </p>

          <p className="mt-5 leading-8 text-gray-700">
            I faced a difficult decision during my first year of college.
            I had to choose between focusing completely on academics or
            investing time into building skills outside the classroom.
            Although it felt risky, I decided to spend time learning
            programming and building projects because I believed it would
            help me grow in the long run.
          </p>

        </div>

        {/* AI Feedback */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            AI Coach Feedback
          </p>

          <div className="mt-5 space-y-3 text-gray-700">

            <p>
              ✓ Strong structure and logical flow.
            </p>

            <p>
              ✓ Good use of personal storytelling.
            </p>

            <p>
              • Reduce filler words during transitions.
            </p>

            <p>
              • Slow down slightly when explaining key points.
            </p>

          </div>

        </div>

        {/* Improved Version */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Improved Version
          </p>

          <p className="mt-5 leading-8 text-gray-700">
            One of the most important decisions I faced during my first
            year of college was whether to focus solely on academics or
            dedicate time to developing practical skills. While the safer
            choice was to concentrate only on coursework, I chose to
            invest time in programming and project development because I
            believed those experiences would have a greater long-term
            impact on my growth.
          </p>

        </div>

        {/* Elite Version */}
        <div className="mt-6 bg-white rounded-3xl p-8 shadow-sm">

          <p className="text-sm text-gray-400">
            Elite Version
          </p>

          <p className="mt-5 leading-8 text-gray-700">
            Growth often demands uncomfortable choices. During my first
            year of college, I faced a decision between following the
            traditional academic path or stepping into uncertainty by
            building practical skills beyond the classroom. Although the
            latter carried greater risk, I chose it because I understood
            that long-term success is rarely created through comfort. That
            decision became the foundation of my personal and professional
            development.
          </p>

        </div>

      </div>
    </main>
  );
}