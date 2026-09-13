"use client";

import { useState } from "react";
import { ReviewPageOne } from "./overview";
import { ReviewPageTwo } from "./insights";

export function SessionReview() {
  const [page, setPage] = useState<1 | 2>(1);

  return (
    <main className="min-h-full bg-[#FCFCFD]">
      {page === 1 ? <ReviewPageOne onNext={() => setPage(2)} /> : <ReviewPageTwo onPrevious={() => setPage(1)} />}
    </main>
  );
}
