import { mockSessionReview } from "@/lib/data/mockSessionReview";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function ReviewPagination({ currentPage, onPrevious, onNext }: Props) {
  const { pagination } = mockSessionReview;
  const dots = Array.from({ length: pagination.totalPages });

  return (
    <div className="mt-auto flex items-center justify-center gap-3 pt-4">
      {onPrevious ? (
        <button type="button" aria-label="Previous review page" onClick={onPrevious} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600">
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : null}
      <div className="flex items-center gap-1.5">
        {dots.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i + 1 === currentPage ? "bg-indigo-600" : "bg-indigo-100"
            }`}
          />
        ))}
      </div>
      <span className="ml-1 text-sm text-gray-400">
        Page {currentPage} of {pagination.totalPages}
      </span>
      {onNext ? (
        <button type="button" aria-label="Next review page" onClick={onNext} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-indigo-200 hover:text-indigo-600">
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
