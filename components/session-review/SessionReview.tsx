"use client";

import { useState } from "react";
import { ReviewPageOne } from "./overview";
import { ReviewPageTwo } from "./insights";
import { buildSessionReview, mockSessionReview } from "@/lib/data/mockSessionReview";

export function SessionReview() {
  const [page, setPage] = useState<1 | 2>(1);
  const [review] = useState(() => {
    if (typeof window === "undefined") return mockSessionReview;
    const saved = sessionStorage.getItem("session-review-input");
    return saved ? buildSessionReview(JSON.parse(saved)) : mockSessionReview;
  });

  return (
    <main className="min-h-full bg-[#FCFCFD]">
      {page === 1 ? <ReviewPageOne review={review} onNext={() => setPage(2)} /> : <ReviewPageTwo review={review} onPrevious={() => setPage(1)} />}
    </main>
  );
}
