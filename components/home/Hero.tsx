export default function Hero() {
  return (
    <section className="px-14 pt-12">

      <div className="grid grid-cols-[1.1fr_0.9fr] gap-12 items-center">

        {/* Left */}

        <div>

          <p className="text-[20px] text-[#4B4B57]">
            Good evening,
          </p>

          <h1
            className="
              mt-2
              text-[72px]
              leading-[74px]
              font-semibold
              tracking-[-0.06em]
              text-[#18181C]
            "
          >
            Namya
            <span className="ml-3 text-[#8B73FF]">
              ✦
            </span>
          </h1>

          <p
            className="
              mt-5
              max-w-xl
              text-[23px]
              leading-9
              text-[#58586C]
            "
          >
            Let&apos;s continue improving your{" "}
            <span className="text-[#7F63FF] font-medium">
              communication.
            </span>
          </p>

        </div>

        {/* Right */}

        <div className="relative h-[260px] rounded-[28px] overflow-hidden">

          <div
            className="
              absolute
              inset-0
              rounded-[28px]
            "
            style={{
              background: `
                radial-gradient(circle at 80% 20%,rgba(255,244,190,.75),transparent 30%),
                radial-gradient(circle at 25% 70%,rgba(180,165,255,.45),transparent 35%),
                linear-gradient(180deg,#FFF8EA,#F8F2FF)
              `,
            }}
          />

        </div>

      </div>

    </section>
  );
}