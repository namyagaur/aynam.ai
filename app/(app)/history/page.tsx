"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MoreHorizontal, Play, Sparkles } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Session = {
  id: string | number;
  user_id: string;
  created_at: string;
  duration_seconds: number | null;
  transcript: string | null;
  analysis: unknown;
  feedback: unknown;
};

type HistorySession = Session & {
  topic: string;
  duration: string;
  score: number | null;
  date: {
    day: string;
    month: string;
    year: string;
  };
  transcriptPreview: string;
  wordCount: number | null;
  skills: {
    clarity: number | null;
    fluency: number | null;
    structure: number | null;
  };
};

function formatDuration(durationSeconds: number | null) {
  const minutes = Math.max(1, Math.round((durationSeconds ?? 0) / 60));
  return `${minutes} min`;
}

function formatDate(createdAt: string) {
  const date = new Date(createdAt);
  return {
    day: date.toLocaleDateString(undefined, { day: "2-digit" }),
    month: date.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
    year: date.toLocaleDateString(undefined, { year: "numeric" }),
  };
}

function getRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function getNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getTranscriptPreview(transcript: string | null) {
  const normalized = (transcript ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "No transcript preview available.";
  }

  const firstSentence = normalized.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? normalized;
  return firstSentence.length > 96 ? `${firstSentence.slice(0, 96).trimEnd()}...` : firstSentence;
}

function getTranscriptTitle(transcript: string | null) {
  const normalized = (transcript ?? "").replace(/\s+/g, " ").trim();
  if (normalized.split(" ").length < 3) {
    return "Past Session";
  }

  const firstSentence = normalized.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() ?? normalized;
  const title = firstSentence.length > 72 ? `${firstSentence.slice(0, 72).trimEnd()}...` : firstSentence;
  return title || "Past Session";
}

function getFeedbackScore(feedback: unknown) {
  const scores: number[] = [];

  const collectScores = (value: unknown) => {
    if (!value || typeof value !== "object") {
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === "score" && typeof child === "number" && Number.isFinite(child)) {
        scores.push(child);
      } else {
        collectScores(child);
      }
    }
  };

  collectScores(feedback);

  if (scores.length === 0) {
    return null;
  }

  const average = scores.reduce((total, score) => total + score, 0) / scores.length;
  return Math.round((average / 10) * 10) / 10;
}

function getSkillScore(feedback: unknown, skill: "clarity" | "fluency" | "structure") {
  const value = getNumber(getRecord(getRecord(feedback)[skill]).score);
  return value === null ? null : Math.round((value / 10) * 10) / 10;
}

function ScoreRing({ score }: { score: number | null }) {
  const progress = score === null ? 0 : Math.min(100, Math.max(0, score * 10));

  return (
    <div
      className="flex h-[64px] w-[64px] items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(var(--theme-primary) ${progress}%, var(--theme-primary-soft) ${progress}% 100%)`,
      }}
    >
      <div className="flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full bg-white">
        <span className="text-[18px] font-semibold tracking-[-0.04em] text-[#393542]">
          {score ?? "—"}
        </span>
        {score !== null ? <span className="text-[8px] uppercase tracking-[0.1em] text-[#aaa2b1]">/ 10</span> : null}
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-4" aria-label="Loading sessions">
      {[0, 1, 2].map((row) => (
        <div key={row} className="h-[184px] animate-pulse rounded-[22px] border border-[#ebe7e1] bg-white p-5 sm:h-[142px] sm:p-6">
          <div className="flex h-full flex-col justify-between gap-5 sm:grid sm:grid-cols-[64px_minmax(0,1fr)_230px_150px] sm:items-center sm:gap-6">
            <div className="h-14 w-10 rounded-xl bg-[#f1eee9]" />
            <div className="space-y-3">
              <div className="h-5 w-64 max-w-full rounded bg-[#f1eee9]" />
              <div className="h-3 w-64 max-w-full rounded bg-[#f5f2ee]" />
              <div className="h-3 w-32 rounded bg-[#f5f2ee]" />
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <div className="h-16 w-16 rounded-full border-[8px] border-[#f1eee9]" />
              <div className="space-y-2">
                <div className="h-2 w-20 rounded bg-[#f5f2ee]" />
                <div className="h-2 w-24 rounded bg-[#f5f2ee]" />
                <div className="h-2 w-16 rounded bg-[#f5f2ee]" />
              </div>
            </div>
            <div className="h-9 w-32 rounded-lg bg-[#f1eee9]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuSessionId, setActiveMenuSessionId] = useState<string | number | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<HistorySession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in to view your session history.");
        setIsLoading(false);
        return;
      }

      const { data, error: sessionsError } = await supabase
        .from("sessions")
        .select(
          "id, user_id, created_at, duration_seconds, transcript, analysis, feedback"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (sessionsError) {
        setError("Unable to load your session history.");
        setIsLoading(false);
        return;
      }

      const historySessions = (data as Session[]).map((session) => ({
        ...session,
        topic: getTranscriptTitle(session.transcript),
        duration: formatDuration(session.duration_seconds),
        score: getFeedbackScore(session.feedback),
        date: formatDate(session.created_at),
        transcriptPreview: getTranscriptPreview(session.transcript),
        wordCount: getNumber(getRecord(getRecord(session.analysis).basic).wordCount),
        skills: {
          clarity: getSkillScore(session.feedback, "clarity"),
          fluency: getSkillScore(session.feedback, "fluency"),
          structure: getSkillScore(session.feedback, "structure"),
        },
      }));

      setSessions(historySessions);
      setIsLoading(false);
    };

    void loadSessions();
  }, []);

  const openFeedback = (session: HistorySession) => {
    const reviewInput = {
      transcript: session.transcript ?? "",
      topic: "Past Session",
      durationSeconds: session.duration_seconds ?? 0,
      analytics: session.analysis,
      review: session.feedback,
    };

    sessionStorage.setItem("session-review-input", JSON.stringify(reviewInput));
    router.push("/session/review");
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (activeMenuSessionId === null) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-session-menu]")) {
        setActiveMenuSessionId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenuSessionId(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMenuSessionId]);

  useEffect(() => {
    if (!sessionToDelete) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        setSessionToDelete(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sessionToDelete, isDeleting]);

  const handleConfirmDelete = async () => {
    if (!sessionToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setToast({
          message: "Couldn't delete this session. Please try again.",
          type: "error",
        });
        setIsDeleting(false);
        setSessionToDelete(null);
        return;
      }

      const { error: deleteError } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionToDelete.id)
        .eq("user_id", user.id);

      if (deleteError) {
        setToast({
          message: "Couldn't delete this session. Please try again.",
          type: "error",
        });
        setIsDeleting(false);
        setSessionToDelete(null);
        return;
      }

      setSessions((prev) => prev.filter((item) => item.id !== sessionToDelete.id));
      setToast({
        message: "Session deleted",
        type: "success",
      });
      setSessionToDelete(null);
    } catch {
      setToast({
        message: "Couldn't delete this session. Please try again.",
        type: "error",
      });
      setSessionToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-full bg-[var(--theme-surface)] px-5 py-7 text-[var(--theme-text)] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">
            <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-[34px] font-semibold tracking-[-0.05em] text-[var(--theme-text)] sm:text-[40px]">Practice History</h1>
                <p className="mt-2 max-w-md text-[14px] leading-6 text-[var(--theme-text-muted)]">Your conversations today build the confident you tomorrow.</p>
                <div className="mt-4 h-1 w-10 rounded-full bg-[var(--theme-accent)]" />
              </div>

              <button
                type="button"
                onClick={() => router.push("/practice")}
                className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-[var(--theme-primary)] px-5 text-[13px] font-medium text-white shadow-[0_8px_20px_rgba(103,88,216,.16)] transition hover:bg-[var(--theme-accent)] sm:self-auto"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Start New Practice
              </button>
            </header>

            <div className="mt-7 flex items-center justify-between">
              {!isLoading && !error && sessions.length > 0 ? (
                <span className="text-[13px] font-medium text-[#696273]">
                  {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
                </span>
              ) : <span />}
              {!isLoading && !error && sessions.length > 0 ? (
                <span className="inline-flex h-10 items-center rounded-xl border border-[#e9e3f1] bg-white/70 px-3.5 text-[12px] text-[#716a7b] shadow-[0_3px_12px_rgba(91,75,116,.03)]">Newest first</span>
              ) : null}
            </div>

            <div className="mt-3">
              {isLoading ? <LoadingRows /> : error ? (
                <div role="alert" className="rounded-[22px] border border-[#eadbd8] bg-[#fffafa] px-6 py-10 text-center">
                  <p className="text-sm font-medium text-[#9d625d]">{error}</p>
                  <p className="mt-2 text-xs text-[#b28c88]">Please try refreshing the page.</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-[24px] border border-[#ebe5de] bg-white px-6 py-16 text-center shadow-[0_8px_30px_rgba(70,55,35,.035)]">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-[#2e2a34]">No practice sessions yet</h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8b8490]">
                    Start your first conversation and your history will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/practice")}
                    className="mt-7 rounded-xl bg-[#242329] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#35333d]"
                  >
                    Start Your First Practice
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <article
                      key={session.id}
                      className="group rounded-[22px] border border-[var(--theme-border)] bg-white p-5 shadow-[0_8px_30px_rgba(70,55,35,.035)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--theme-border)] hover:shadow-[0_12px_34px_rgba(70,55,35,.08)] sm:p-6"
                    >
                      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[64px_minmax(0,1fr)_230px_170px] lg:items-center lg:gap-6">
                        <div className="flex items-center gap-3 lg:block">
                          <div className="text-[10px] font-semibold tracking-[0.16em] text-[#9b93a1]">{session.date.month}</div>
                          <div className="text-[24px] font-semibold leading-none tracking-[-0.05em] text-[#322e38] lg:mt-2">{session.date.day}</div>
                          <div className="text-[11px] text-[#b0a9b2] lg:mt-1">{session.date.year}</div>
                        </div>

                        <div className="min-w-0 border-t border-[#f0ece8] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                          <h3 className="max-w-[620px] text-[18px] font-semibold leading-6 tracking-[-0.03em] text-[#2d2932]">{session.topic}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#918a96]">
                            <span>{session.duration}</span>
                            <span className="h-1 w-1 rounded-full bg-[#c9c2cc]" />
                            <span>{session.wordCount === null ? "Word count unavailable" : `${session.wordCount} words`}</span>
                          </div>
                          <p className="mt-3 max-w-[620px] truncate text-[13px] italic leading-5 text-[#8c8690]">“{session.transcriptPreview}”</p>
                        </div>

                        <div className="flex items-center gap-5 border-t border-[#f0ece8] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                          <div className="flex shrink-0 flex-col items-center gap-1">
                            <ScoreRing score={session.score} />
                            <span className="text-[10px] text-[#958da0]">Overall</span>
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#aaa2ad]">Skill snapshot</p>
                            {(["clarity", "fluency", "structure"] as const).map((skill) => (
                              <div key={skill} className="flex items-center justify-between gap-3 text-[11px]">
                                <span className="capitalize text-[#8f8894]">{skill}</span>
                                <span className="font-semibold text-[#3b3641]">{session.skills[skill] ?? "—"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 border-t border-[#f0ece8] pt-5 lg:border-l lg:border-t-0 lg:justify-end lg:pl-6 lg:pt-0">
                          <button
                            type="button"
                            onClick={() => openFeedback(session)}
                            className="inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-[var(--theme-border)] bg-[var(--theme-primary-soft)] px-2.5 text-[11px] font-medium text-[var(--theme-primary)] transition hover:border-[var(--theme-border)] hover:bg-[var(--theme-surface)]"
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                          <div className="relative" data-session-menu>
                            <button
                              type="button"
                              aria-label="More session actions"
                              onClick={() =>
                                setActiveMenuSessionId((prev) =>
                                  prev === session.id ? null : session.id
                                )
                              }
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#b3acb8] transition hover:bg-[#f6f2fb] hover:text-[#66549b]"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {activeMenuSessionId === session.id && (
                              <div className="absolute right-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-[#ebe6e0] bg-white p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuSessionId(null);
                                    openFeedback(session);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12px] font-medium text-[#3b3641] transition hover:bg-[#f6f2fb] hover:text-[#6758d8]"
                                >
                                  <Eye className="h-3.5 w-3.5 text-[#8f8894]" />
                                  <span>View feedback</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuSessionId(null);
                                    setSessionToDelete(session);
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12px] font-medium text-[#dc2626] transition hover:bg-[#fef2f2]"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-[#dc2626]" />
                                  <span>Delete session</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {sessionToDelete && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-session-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
            >
              <div className="w-full max-w-sm rounded-[22px] border border-[#ebe6e0] bg-white p-6 shadow-2xl">
                <h3
                  id="delete-session-dialog-title"
                  className="text-[17px] font-semibold tracking-[-0.02em] text-[#292633]"
                >
                  Delete this session?
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-[#7b7484]">
                  This will permanently remove this practice session and its feedback.
                </p>
                <div className="mt-6 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isDeleting) setSessionToDelete(null);
                    }}
                    disabled={isDeleting}
                    className="rounded-xl border border-[#ebe6e0] bg-white px-4 py-2 text-[13px] font-medium text-[#696273] transition hover:bg-[#f8f6f4] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center justify-center rounded-xl bg-[#dc2626] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-[#b91c1c] disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {toast && (
            <div
              role="status"
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#3b3745] bg-[#292633] px-4 py-3 text-[13px] font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#34d399]" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-[#f87171]" />
              )}
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss notification"
                className="ml-1 text-white/60 transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </main>
  );
}
