import ReviewHeader from "./ReviewHeader";

export default function ReviewPageOne() {
  return (
    <section className="mx-auto w-full max-w-6xl">

      <ReviewHeader />

      <section className="mt-10 flex flex-col items-center">

        <h1 className="text-5xl font-semibold tracking-tight text-[#5B5CEB]">
          Session Review
        </h1>

        <p className="mt-3 text-lg text-[#6B7280]">
          Great job, Namya! Here's your communication breakdown.
        </p>

      </section>

    </section>
  );
}