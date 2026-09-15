"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AudioLines, BarChart3, Flag, Lightbulb, RefreshCw } from "lucide-react";
import type { SessionReviewData } from "@/lib/data/mockSessionReview";
import { ReviewIntro } from "../overview/ReviewIntro";
import { ReviewPagination } from "../overview/ReviewPagination";
import { publicSpeakingTopics, conversationTopics, storytellingTopics, socialTopics } from "@/components/practice/data/topics";

const challengeTopics = [...publicSpeakingTopics, ...conversationTopics, ...storytellingTopics, ...socialTopics];

export function ReviewPageTwo({ onPrevious, review }: { onPrevious: () => void; review: SessionReviewData }) {
  const router = useRouter();
  const { insights } = review;
  const [challenge, setChallenge] = useState(insights.challenge);
  const maxFiller = Math.max(1, ...insights.fillers.map((item) => item.count));

  const chooseDifferentChallenge = () => {
    const options = challengeTopics.filter((topic) => topic !== challenge);
    setChallenge(options[Math.floor(Math.random() * options.length)] ?? challenge);
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1120px] flex-col px-10 pt-6 pb-6">
      <ReviewIntro session={review.session} title={insights.title} subtitle={insights.subtitle} />
      <div className="mt-5 grid grid-cols-5 grid-rows-[1fr_0.92fr] gap-4">
        <section className="col-span-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <SectionTitle icon={Lightbulb} label="Try saying it like this" />
          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <RewriteCopy label="Your version" text={insights.rewrite.original} tone="bg-gray-50" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-700"><ArrowRight className="h-4 w-4" /></span>
            <RewriteCopy label="Try this instead" text={insights.rewrite.suggested} tone="bg-emerald-50/60" accent />
          </div>
          <p className="mt-3 rounded-xl bg-violet-50 px-3 py-2 text-[11px] leading-4 text-gray-600"><span className="font-semibold text-violet-700">Why? </span>{insights.rewrite.reason}</p>
        </section>
        <section className="col-span-2 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-4 shadow-sm"><SectionTitle icon={AudioLines} label="Top Fillers Used" /><div className="mt-5 space-y-4">{insights.fillers.length ? insights.fillers.map((item) => <div key={item.label} className="grid grid-cols-[54px_1fr_20px] items-center gap-2 text-xs"><span>{item.label}</span><span className="h-1.5 overflow-hidden rounded-full bg-[var(--theme-accent-soft)]"><span className="block h-full rounded-full bg-[var(--theme-accent)]" style={{ width: `${item.count / maxFiller * 100}%` }} /></span><b className="text-right">{item.count}</b></div>) : <p className="text-xs text-[var(--theme-text-muted)]">No filler words detected in this session.</p>}</div></section>
        <section className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><SectionTitle icon={BarChart3} label="Quick Stats" /><dl className="mt-4 space-y-1.5">{insights.quickStats.map((item) => <div key={item.label} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs"><dt className="text-gray-500">{item.label}</dt><dd className="font-semibold">{item.value}</dd></div>)}</dl></section>
        <section className="col-span-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-4 shadow-sm"><SectionTitle icon={Flag} label="Your Next Challenge" /><div className="mt-4 flex gap-3 rounded-xl bg-[var(--theme-accent-soft)] px-4 py-4"><Flag className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-accent)]" /><p className="text-sm font-medium leading-5 text-[var(--theme-text)]">{challenge}</p></div><button type="button" onClick={() => router.push(`/practice?topic=${encodeURIComponent(challenge)}`)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--theme-primary)] py-2.5 text-sm font-medium text-white">Accept Challenge <ArrowRight className="h-4 w-4" /></button><button type="button" onClick={chooseDifferentChallenge} className="mx-auto mt-3 flex items-center gap-2 text-xs text-[var(--theme-text-muted)]"><RefreshCw className="h-3.5 w-3.5" />Or choose a different challenge</button></section>
      </div>
      <ReviewPagination currentPage={2} onPrevious={onPrevious} />
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: typeof Lightbulb; label: string }) {
  return <div className="flex items-center gap-2 text-sm font-semibold text-[var(--theme-text)]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]"><Icon className="h-4 w-4" /></span>{label}</div>;
}

function RewriteCopy({ label, text, tone, accent = false }: { label: string; text: string; tone: string; accent?: boolean }) {
  return <div className={`min-h-28 rounded-xl p-3 ${tone}`}><p className={`text-[10px] font-semibold uppercase tracking-wide ${accent ? "text-emerald-600" : "text-gray-500"}`}>{label}</p><p className="mt-3 text-xs leading-5 text-gray-700">“{text}”</p></div>;
}
