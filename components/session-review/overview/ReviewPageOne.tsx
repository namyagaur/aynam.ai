import { ReviewIntro } from "./ReviewIntro";
import { CommunicationProfileCard } from "./CommunicationProfileCard";
import { SessionHighlights } from "./SessionHighlights";
import { ReviewPagination } from "./ReviewPagination";

export function ReviewPageOne({ onNext }: { onNext: () => void }) {
  return (
<div className="mx-auto flex min-h-full w-full max-w-[1120px] flex-col px-10 pt-6 pb-6">
    <ReviewIntro onNext={onNext} />
      <div className="mt-5 flex flex-col gap-5">
        <CommunicationProfileCard />
        <SessionHighlights />
        <ReviewPagination currentPage={1} />
      </div>
    </div>
  );
}
