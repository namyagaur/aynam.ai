import { ArrowLeft, AudioLines } from "lucide-react";
import { mockSessionReview } from "@/lib/data/mockSessionReview";

type Props = { title?: string; subtitle?: string; onNext?: () => void; session?: typeof mockSessionReview.session };

export function ReviewIntro({ title = "Session Review", subtitle, onNext, session = mockSessionReview.session }: Props) {

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-[var(--theme-text-muted)] transition-colors hover:text-[var(--theme-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          End Session
        </button>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--theme-accent)]">
              {session.durationLabel}
            </span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--theme-border)] text-[var(--theme-text-muted)] transition-colors hover:bg-[var(--theme-accent-soft)]"
            >
              <AudioLines className="h-3.5 w-3.5" />
            </button>
          </div>
          {onNext ? <button type="button" onClick={onNext} className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--theme-primary)] shadow-sm transition hover:bg-[var(--theme-primary-soft)]">Next →</button> : null}
        </div>
      </div>

      <div className="mt-2 text-center">
        <h1 className="text-[30px] font-bold tracking-tight text-[var(--theme-primary)]">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-[var(--theme-text-muted)]">{subtitle ?? session.subtitle}</p>
      </div>
    </div>
  );
}
