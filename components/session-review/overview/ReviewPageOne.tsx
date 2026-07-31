import { ReviewIntro } from "./ReviewIntro";
import { CommunicationProfileCard } from "./CommunicationProfileCard";
import { SessionHighlights } from "./SessionHighlights";
import { ReviewPagination } from "./ReviewPagination";

export function ReviewPageOne() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[980px] flex-col px-10 pt-4">
      <ReviewIntro />
      <div className="mt-3">
        <CommunicationProfileCard />
        <SessionHighlights />
        <ReviewPagination />
      </div>
    </div>
  );
}