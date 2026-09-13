import { ReviewIntro } from "./ReviewIntro";
import { CommunicationProfileCard } from "./CommunicationProfileCard";
import { SessionHighlights } from "./SessionHighlights";
import { ReviewPagination } from "./ReviewPagination";
import type { SessionReviewData } from "@/lib/data/mockSessionReview";

export function ReviewPageOne({ onNext, review }: { onNext: () => void; review: SessionReviewData }) {
  return (
<div className="mx-auto flex min-h-full w-full max-w-[1120px] flex-col px-10 pt-6 pb-6">
    <ReviewIntro session={review.session} onNext={onNext} />
      <div className="mt-5 flex flex-col gap-5">
        <CommunicationProfileCard profile={review.communicationProfile} />
        <SessionHighlights highlights={review.highlights} />
        <ReviewPagination currentPage={1} />
      </div>
    </div>
  );
}
