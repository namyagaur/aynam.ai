export default function ReviewIntro() {
  return (
    <section className="mb-12">

      {/* Top Bar */}

      <div className="flex items-center justify-between">

        <button className="flex items-center gap-2 text-[15px] font-medium text-[#4B5563] transition hover:text-black">

          <span className="text-lg">←</span>

          <span>End Session</span>

        </button>

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-[#F3F0FF] px-5 py-2 text-sm font-medium text-[#5B5CEB]">

            3 min selected

          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ECECEC] bg-white shadow-sm transition hover:bg-[#FAFAFA]">

            ✦

          </button>

        </div>

      </div>

      {/* Title */}

      <div className="mt-14 flex flex-col items-center">

        <h1 className="text-[54px] font-semibold tracking-[-0.04em] text-[#5B5CEB]">

          Session Review

        </h1>

        <p className="mt-3 text-[17px] text-[#6B7280]">

          Great job, Namya! Here's your communication breakdown.

        </p>

      </div>

    </section>
  );
}