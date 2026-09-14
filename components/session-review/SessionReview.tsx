"use client";

import { useEffect, useRef, useState } from "react";
import { ReviewPageOne } from "./overview";
import { ReviewPageTwo } from "./insights";
import { buildSessionReview, mockSessionReview } from "@/lib/data/mockSessionReview";
import { supabase } from "@/lib/supabase/client";

export function SessionReview() {
  const [page, setPage] = useState<1 | 2>(1);
  const saveAttemptedRef = useRef(false);
  const [review, setReview] = useState(() => {
    if (typeof window === "undefined") return mockSessionReview;
    const saved = sessionStorage.getItem("session-review-input");
    return saved ? buildSessionReview(JSON.parse(saved)) : mockSessionReview;
  });
  const [isGenerating, setIsGenerating] = useState(() => typeof window !== "undefined" && Boolean(sessionStorage.getItem("session-review-input")) && !Boolean(JSON.parse(sessionStorage.getItem("session-review-input") || "{}").review));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("session-review-input");
    if (!saved) return;
    const input = JSON.parse(saved);
    if (input.review) return;
    void fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || "Unable to generate your AI review.");
        return response.json();
      })
      .then((feedback) => {
        const completed = { ...input, ...feedback };
        sessionStorage.setItem("session-review-input", JSON.stringify(completed));
        setReview(buildSessionReview(completed));

        const persistenceFingerprint = JSON.stringify(completed);
        if (saveAttemptedRef.current || sessionStorage.getItem("session-review-saved") === persistenceFingerprint) {
          return;
        }

        saveAttemptedRef.current = true;
        sessionStorage.setItem("session-review-saved", persistenceFingerprint);
        void (async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            console.error("Unable to save completed session: no authenticated user.");
            return;
          }

          const { error } = await supabase.from("sessions").insert({
            user_id: user.id,
            created_at: new Date().toISOString(),
            duration_seconds: completed.durationSeconds,
            transcript: completed.transcript,
            analysis: completed.analytics,
            feedback: completed.review,
          });

          if (error) {
            console.error("Unable to save completed session:", error);
          }
        })();
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to generate your AI review."))
      .finally(() => setIsGenerating(false));
  }, []);

  return (
    <main className="min-h-full bg-[#FCFCFD]">
      {isGenerating ? <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-center"><span className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" /><h1 className="text-xl font-semibold text-indigo-600">Creating your AI review…</h1><p className="text-sm text-gray-500">Analyzing your transcript, pace, fillers, and communication style.</p></div> : error ? <div className="p-10 text-center text-red-600">{error}</div> : page === 1 ? <ReviewPageOne review={review} onNext={() => setPage(2)} /> : <ReviewPageTwo review={review} onPrevious={() => setPage(1)} />}
    </main>
  );
}
