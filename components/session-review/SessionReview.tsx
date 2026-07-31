"use client";

import { useState } from "react";
import ReviewHeader from "./ReviewHeader";
import ReviewPageOne from "./ReviewPageOne";
import ReviewPageTwo from "./ReviewPageTwo";

export default function SessionReview() {
  const [page, setPage] = useState(0);

  return (
    <main className="min-h-screen bg-background px-10 py-8">
      <ReviewHeader />

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${page * 100}%)`,
          }}
        >
          <div className="w-full shrink-0">
            <ReviewPageOne />
          </div>

          <div className="w-full shrink-0">
            <ReviewPageTwo />
          </div>
        </div>
      </div>

      <button
        onClick={() => setPage((p) => (p === 0 ? 1 : 0))}
        className="absolute left-1/2 top-1/2 z-50 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-lg transition hover:scale-105"
      >
        {page === 0 ? "?" : "?"}
      </button>
    </main>
  );
}
