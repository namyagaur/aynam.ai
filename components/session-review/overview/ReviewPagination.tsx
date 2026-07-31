import { mockSessionReview } from "@/lib/data/mockSessionReview";

export function ReviewPagination() {
  const { pagination } = mockSessionReview;
  const dots = Array.from({ length: pagination.totalPages });

  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      <div className="flex items-center gap-1.5">
        {dots.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i + 1 === pagination.currentPage ? "bg-indigo-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="ml-1 text-sm text-gray-400">
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
    </div>
  );
}