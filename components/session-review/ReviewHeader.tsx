export default function ReviewHeader() {
  return (
    <header className="mb-10">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          ? End Session
        </button>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            3 min selected
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border">
            ?
          </button>
        </div>
      </div>

      <div className="mt-14 text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-primary">
          Session Review
        </h1>

        <p className="mt-5 text-lg text-muted-foreground">
          Great job, Namya! Here's your communication breakdown.
        </p>
      </div>
    </header>
  );
}
