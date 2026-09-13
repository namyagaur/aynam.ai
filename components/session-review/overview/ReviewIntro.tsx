import { ArrowLeft, AudioLines } from "lucide-react";
import { mockSessionReview } from "@/lib/data/mockSessionReview";

type Props = { title?: string; subtitle?: string; onNext?: () => void; session?: typeof mockSessionReview.session };

export function ReviewIntro({ title = "Session Review", subtitle, onNext, session = mockSessionReview.session }: Props) {

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          End Session
        </button>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              {session.durationLabel}
            </span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
            >
              <AudioLines className="h-3.5 w-3.5" />
            </button>
          </div>
          {onNext ? <button type="button" onClick={onNext} className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm transition hover:bg-indigo-50">Next →</button> : null}
        </div>
      </div>

      <div className="mt-2 text-center">
        <h1 className="text-[30px] font-bold tracking-tight text-indigo-600">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">{subtitle ?? session.subtitle}</p>
      </div>
    </div>
  );
}
