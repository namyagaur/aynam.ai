import { ReviewIntro } from "./ReviewIntro";
import { CommunicationProfileCard } from "./CommunicationProfileCard";
import { SessionHighlights } from "./SessionHighlights";
import { ReviewPagination } from "./ReviewPagination";

export function ReviewPageOne() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[540px] flex-col justify-center px-6 py-6">
      <ReviewIntro />
      <div className="mt-6">
        <CommunicationProfileCard />
        <SessionHighlights />
        <ReviewPagination />
      </div>
    </div>
  );
}