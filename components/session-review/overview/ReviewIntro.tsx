import { ArrowLeft, AudioLines } from "lucide-react";
import { mockSessionReview } from "@/lib/data/mockSessionReview";

export function ReviewIntro() {
  const { session } = mockSessionReview;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          End Session
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-sm font-medium text-indigo-600">
            {session.durationLabel}
          </span>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50"
          >
            <AudioLines className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600">
          Session Review
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">{session.subtitle}</p>
      </div>
    </div>
  );
}