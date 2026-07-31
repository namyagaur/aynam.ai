"use client";

import { useState } from "react";
import ReviewPageOne from "./ReviewPageOne";
import ReviewPageTwo from "./ReviewPageTwo";

export default function SessionReview() {
  const [page, setPage] = useState(0);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => setPage(0)}
          className="rounded-xl border px-4 py-2"
        >
          Page 1
        </button>

        <button
          onClick={() => setPage(1)}
          className="rounded-xl border px-4 py-2"
        >
          Page 2
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border">
        <div
          className="flex transition-transform duration-500"
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
    </main>
  );
}
