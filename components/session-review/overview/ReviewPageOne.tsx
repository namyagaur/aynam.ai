import ReviewIntro from "./ReviewIntro";
import CommunicationProfileCard from "./CommunicationProfileCard";
import SessionHighlights from "./SessionHighlights";
import ReviewPagination from "./ReviewPagination";

export default function ReviewPageOne() {
  return (
    <div className="mx-auto max-w-6xl">

      <ReviewIntro />

      <CommunicationProfileCard />

      <SessionHighlights />

      <ReviewPagination />

    </div>
  );
}