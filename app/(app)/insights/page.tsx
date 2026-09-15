"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AudioLines, BarChart2, BookOpen, Clock3, FileText, Flag, Grid3X3, Lightbulb, ListChecks, MessageSquare, PieChart, Play, RefreshCw, Sparkles, Star, Target, Users } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Period = "7 days" | "30 days" | "All time";
type InsightTab = "communication" | "patterns" | "progress" | "recommendations";

type Session = {
  id: string | number;
  user_id: string;
  created_at: string;
  duration_seconds: number | null;
  elapsed_duration_seconds: number | null;
  speaking_duration_seconds: number | null;
  topic?: string | null;
  analysis: unknown;
  feedback: unknown;
};

const periods: Period[] = ["7 days", "30 days", "All time"];
const insightTabs: Array<{ id: InsightTab; label: string }> = [
  { id: "communication", label: "My Communication" },
  { id: "patterns", label: "Patterns" },
  { id: "progress", label: "Progress" },
  { id: "recommendations", label: "Recommendations" },
];

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function numeric(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nestedNumber(value: unknown, ...keys: string[]): number | null {
  let current = value;
  for (const key of keys) {
    current = object(current)[key];
  }
  return numeric(current);
}

function average(values: Array<number | null>): number | null {
  const valid = values.filter((value): value is number => value !== null);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

type Trend = "steady" | "up" | "down" | "improving" | "worsening" | "unknown";

function compareHalves(values: number[]): Trend {
  if (values.length < 2) return "unknown";
  const split = Math.ceil(values.length / 2);
  const earlier = average(values.slice(0, split));
  const recent = average(values.slice(split));
  if (earlier === null || recent === null) return "unknown";
  const difference = recent - earlier;
  if (Math.abs(difference) <= 3) return "steady";
  return difference > 0 ? "up" : "down";
}

function compareFillerHalves(values: number[]): Trend {
  if (values.length < 2) return "unknown";
  const split = Math.ceil(values.length / 2);
  const earlier = average(values.slice(0, split));
  const recent = average(values.slice(split));
  if (earlier === null || recent === null || earlier === 0) return "unknown";
  const change = (recent - earlier) / earlier;
  if (change <= -0.15) return "down";
  if (change >= 0.15) return "up";
  return "steady";
}

function fillerTrendLabel(trend: Trend): string | null {
  if (trend === "down") return "Fewer over time";
  return null;
}

function asScore(value: unknown): number | null {
  const number = numeric(value);
  if (number === null) return null;
  if (number <= 10) return number * 10;
  return Math.min(100, Math.max(0, number));
}

function getFeedbackSkillScore(feedback: unknown, skill: string): number | null {
  const skillObject = object(object(feedback)[skill]);
  const score = asScore(skillObject.score);
  return score === null ? null : Math.round(score);
}

function getCommunicationScore(feedback: unknown): number | null {
  const scores = [
    getFeedbackSkillScore(feedback, "clarity"),
    getFeedbackSkillScore(feedback, "fluency"),
    getFeedbackSkillScore(feedback, "structure"),
    getFeedbackSkillScore(feedback, "confidence"),
    getFeedbackSkillScore(feedback, "vocabulary"),
  ].filter((value): value is number => value !== null);

  return scores.length ? average(scores) : null;
}

function speakingRate(analysis: unknown): number | null {
  return nestedNumber(analysis, "pace", "wordsPerMinute") ?? nestedNumber(analysis, "wordsPerMinute");
}

function rangeStart(period: Period): Date | null {
  if (period === "All time") return null;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - Number.parseInt(period, 10));
  return date;
}

function tabFromQuery(value: string | null): InsightTab {
  switch (value) {
    case "patterns":
      return "patterns";
    case "progress":
      return "progress";
    case "recommendations":
      return "recommendations";
    case "communication":
    case "my-communication":
    default:
      return "communication";
  }
}

type DimensionScore = { label: string; value: number | null };

/** Kept in one selector so Communication and Recommendations cannot choose different priorities. */
function getFocusDimension(profile: DimensionScore[], sessionCount: number) {
  if (sessionCount < 2) return null;
  return profile
    .filter((item): item is { label: string; value: number } => item.value !== null)
    .sort((a, b) => a.value - b.value)[0] ?? null;
}

export default function InsightsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <InsightsContent />
    </Suspense>
  );
}

function InsightsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [period, setPeriod] = useState<Period>("7 days");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab = useMemo(() => tabFromQuery(searchParams.get("tab")), [searchParams]);

  const navigateToTab = (tab: InsightTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "communication") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const loadSessions = async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please sign in to view your communication insights.");
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("sessions")
      .select("id, user_id, created_at, duration_seconds, elapsed_duration_seconds, speaking_duration_seconds, topic, analysis, feedback")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (queryError) {
      setError("Unable to load your communication insights.");
      setLoading(false);
      return;
    }

    setSessions((data as Session[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadSessions());
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <StateMessage message={error} onRetry={() => void loadSessions()} />;

  const start = rangeStart(period);
  const visible = sessions.filter((session) => !start || new Date(session.created_at) >= start);
  if (!visible.length && activeTab !== "recommendations") return <EmptyState hasSessions={sessions.length > 0} />;

  const paceValues = visible.map((session) => speakingRate(session.analysis));
  const averagePace = average(paceValues);
  const pacePoints = visible.flatMap((session, index) => paceValues[index] === null ? [] : [{ label: new Date(session.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" }), value: paceValues[index] as number }]);
  const paceTrend = compareHalves(pacePoints.map((point) => point.value));

  const fillerValues = visible.map((session) => nestedNumber(session.analysis, "fillers", "total"));
  const fillerTotal = fillerValues.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  const fillerWords: Map<string, number> = visible.flatMap((session) => {
    const words = object(object(session.analysis).fillers).words;
    return Array.isArray(words) ? words : [];
  }).reduce((counts, item) => {
    const filler = object(item);
    const word = typeof filler.word === "string" ? filler.word : null;
    const count = numeric(filler.count);
    if (word && count !== null) counts.set(word, (counts.get(word) ?? 0) + count);
    return counts;
  }, new Map<string, number>());
  const fillerTrend = compareFillerHalves(fillerValues.filter((value): value is number => value !== null));
  const sentenceAverage = average(visible.map((session) => nestedNumber(session.analysis, "sentences", "averageSentenceLength")));
  const totalElapsedSeconds = visible.reduce((sum, session) => sum + (session.elapsed_duration_seconds ?? session.duration_seconds ?? 0), 0);
  const totalSpeakingSeconds = visible.reduce((sum, session) => sum + (session.speaking_duration_seconds ?? 0), 0);
  const utilizationRatio = totalElapsedSeconds > 0 ? totalSpeakingSeconds / totalElapsedSeconds : null;
  const topicCounts = new Map<string, number>();
  for (const session of visible) {
    const topic = session.topic?.trim();
    if (!topic) continue;
    topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
  }
  const topTopics = Array.from(topicCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const communicationScores = visible.map((session) => getCommunicationScore(session.feedback));
  const overallCommunicationScore = average(communicationScores);
  const communicationTrend = visible.flatMap((session, index) => communicationScores[index] === null ? [] : [{
    label: new Date(session.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: communicationScores[index] as number,
  }]);
  const profile = ["clarity", "fluency", "structure", "confidence", "vocabulary"].map((skill) => ({
    label: skill.charAt(0).toUpperCase() + skill.slice(1),
    value: average(visible.map((session) => getFeedbackSkillScore(session.feedback, skill))),
  }));
  profile.push({ label: "Presence", value: null });
  const strongest = profile.filter((item): item is { label: string; value: number } => item.value !== null).sort((a, b) => b.value - a.value)[0] ?? null;
  const focus = getFocusDimension(profile, visible.length);
  const progressSkills = profile.map((item) => {
    const values = visible.map((session) => getFeedbackSkillScore(session.feedback, item.label.toLowerCase())).filter((value): value is number => value !== null);
    return { label: item.label, first: values.length > 0 ? values[0] : null, latest: values.length > 0 ? values[values.length - 1] : null, change: values.length > 1 ? Math.round(values[values.length - 1] - values[0]) : null };
  });
  const progressPoints = communicationTrend.map((point, index) => ({ ...point, session: index + 1 }));
  const totalPracticeSeconds = visible.reduce((sum, session) => sum + (session.duration_seconds ?? session.elapsed_duration_seconds ?? 0), 0);

  const formattedPace = averagePace !== null ? Math.round(averagePace) : null;
  const scoreHeadline = overallCommunicationScore !== null ? Math.round(overallCommunicationScore) : null;

  return (
    <main className="min-h-full bg-[#FFFDF7] px-4 py-4 text-[#24232B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex flex-col gap-3 border-b border-[#e7e1db] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a757f]">Insights</p>
            <h1 className="mt-1.5 text-[32px] font-bold tracking-[-0.055em] text-[#1a1a2e] sm:text-[38px]">
              {tabLabel(activeTab)}
            </h1>
            <p className="mt-1 text-[14px] text-[#5b5b6b]">
              {activeTab === "communication" && "Here's what Aynam has learned about how you communicate."}
              {activeTab === "patterns" && "Small habits become easier to notice with practice."}
              {activeTab === "progress" && "See how your communication is evolving with practice."}
              {activeTab === "recommendations" && "Your next steps, based on how you've been communicating."}
            </p>
          </div>

          <div className="flex items-center self-start sm:self-auto">
            <div className="flex rounded-[12px] border border-[#e8e2dc] bg-[#f2efe9] p-1 shadow-[0_4px_12px_rgba(17,17,18,0.02)]">
              {periods.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPeriod(option)}
                  aria-pressed={period === option}
                  className={`rounded-[10px] px-3 py-1.5 text-[12px] transition-colors ${
                    period === option
                      ? "bg-[#ece3ff] text-[#2f2544] ring-1 ring-[#d8cfe8]"
                      : "text-[#69636f] hover:text-[#1f1e26]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="mt-3 border-b border-[#e7e1db] pb-2">
          <nav className="flex gap-7 text-[14px] text-[#65606d]">
            {insightTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateToTab(tab.id)}
                  className={`relative pb-2 text-left transition-colors ${isActive ? "text-[var(--theme-primary)]" : "text-[var(--theme-text)] hover:text-[var(--theme-primary)]"}`}
                >
                  {tab.label}
                  {isActive ? <span className="absolute inset-x-0 -bottom-[9px] h-[2px] rounded-full bg-[var(--theme-accent)]" /> : null}
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === "communication" ? (
            <CommunicationView score={scoreHeadline} trend={communicationTrend} profile={profile} strongest={strongest} focus={focus} sessionCount={visible.length} practiceSeconds={totalPracticeSeconds} pace={formattedPace} />
        ) : null}

        {activeTab === "patterns" ? (
          <PatternsView
            averagePace={averagePace}
            pacePoints={pacePoints}
            paceTrend={paceTrend}
            fillerTotal={fillerTotal}
            fillerWords={Array.from(fillerWords.entries()).sort((a, b) => b[1] - a[1])}
            fillerTrend={fillerTrend}
            sentenceAverage={sentenceAverage}
            utilizationRatio={utilizationRatio}
            totalSpeakingSeconds={totalSpeakingSeconds}
            totalElapsedSeconds={totalElapsedSeconds}
            topTopics={topTopics}
            visible={visible}
          />
        ) : null}

        {activeTab === "progress" ? <ProgressView trend={progressPoints} profile={progressSkills} sessions={visible} recentSessions={visible} /> : null}
        {activeTab === "recommendations" ? <RecommendationsView focus={focus} progressSkills={progressSkills} sessionCount={visible.length} /> : null}
      </div>
    </main>
  );
}

function tabLabel(tab: InsightTab) {
  if (tab === "communication") return "Your communication";
  return insightTabs.find((option) => option.id === tab)?.label ?? "Your communication";
}

function CommunicationView({ score, trend, profile, strongest, focus, sessionCount, practiceSeconds, pace }: {
  score: number | null;
  trend: Array<{ label: string; score: number }>;
  profile: Array<{ label: string; value: number | null }>;
  strongest: { label: string; value: number } | null;
  focus: { label: string; value: number } | null;
  sessionCount: number;
  practiceSeconds: number;
  pace: number | null;
}) {
  const formatPractice = practiceSeconds >= 60 ? `${Math.round(practiceSeconds / 60)} min` : `${Math.round(practiceSeconds)} sec`;
  return (
    <section className="mt-4 grid gap-3 md:grid-cols-12">
      <div className="rounded-[18px] border border-[rgba(36,35,43,0.08)] bg-white p-4 shadow-[0_4px_14px_rgba(42,35,55,0.04)] md:col-span-8 md:grid md:grid-cols-[0.78fr_1.22fr] md:gap-4">
        <div className="border-b border-[rgba(36,35,43,0.08)] pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
          <div className="flex items-center gap-3"><IconCircle icon={<Sparkles className="h-4 w-4" />} /><p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#7b8192]">Overall</p></div>
          <h2 className="mt-3 text-[18px] font-medium tracking-[-0.03em] text-[#24232b]">Overall communication</h2>
          <div className="mt-2 flex items-end gap-2"><span className="text-[48px] font-semibold leading-none tracking-[-0.08em] text-[#24232b]">{score ?? "â€”"}</span>{score !== null ? <span className="pb-1.5 text-[14px] text-[#7b8192]">/ 100</span> : null}</div>
          <div className="mt-3 inline-flex rounded-full bg-[#eff9f2] px-2.5 py-1 text-[10px] text-[#47735b]">Based on {sessionCount} sessions</div>
          <p className="mt-3 text-[12px] leading-5 text-[#687184]">{sessionCount < 2 ? "Your communication baseline is starting to take shape." : "Your current baseline across the communication skills Aynam measures."}</p>
        </div>
        <div className="pt-4 md:pt-0"><div className="flex items-center justify-between"><h2 className="text-[15px] font-medium text-[#24232b]">Communication score over time</h2><span className="text-[10px] text-[#7b8192]">{sessionCount} sessions</span></div>{trend.length > 1 ? <CommunicationChart points={trend} /> : <p className="mt-8 border-t border-dashed border-[#d9d5e5] pt-3 text-[12px] text-[#687184]">Your baseline is still forming.</p>}</div>
      </div>

      <Observation label="Strongest" item={strongest} description={strongest ? `Your ${strongest.label.toLowerCase()} is coming through more clearly than your other measured communication dimensions.` : "More sessions will give Aynam enough signal to identify your strongest dimension."} icon={<Star className="h-4 w-4" />} tone="bg-[#eaf7ec]" className="md:col-span-4" badge="Your strength" />

      <div className="rounded-[18px] border border-[rgba(36,35,43,0.08)] bg-white p-4 shadow-[0_4px_14px_rgba(42,35,55,0.04)] md:col-span-5"><div className="flex items-center gap-3"><IconCircle icon={<Grid3X3 className="h-4 w-4" />} /><h2 className="text-[18px] font-medium tracking-[-0.03em] text-[#24232b]">Your communication profile</h2></div><div className="mt-4 space-y-3">{profile.map((item) => <div key={item.label} className="grid grid-cols-[90px_1fr_24px] items-center gap-2 text-[12px]"><span className="text-[#24232b]">{item.label}</span><div className="h-1.5 overflow-hidden rounded-full bg-[#e7e3fa]">{item.value !== null ? <div className="h-full rounded-full bg-[#7c6fea]" style={{ width: `${item.value}%` }} /> : null}</div><span className="text-right text-[#687184]">{item.value !== null ? Math.round(item.value) : "â€”"}</span></div>)}</div></div>

      <Observation label="Next focus" item={focus} description={focus ? `Your ${focus.label.toLowerCase()} has room to become more continuous.` : "More sessions will give Aynam enough signal to identify your next focus."} icon={<Target className="h-4 w-4" />} tone="bg-[#f1eefe]" className="md:col-span-4" badge="Area to improve" />

      <div className="rounded-[18px] border border-[rgba(36,35,43,0.08)] bg-white p-4 shadow-[0_4px_14px_rgba(42,35,55,0.04)] md:col-span-3"><div className="flex items-center gap-3"><IconCircle icon={<Clock3 className="h-4 w-4" />} /><h2 className="text-[16px] font-medium text-[#24232b]">Quick stats</h2></div><div className="mt-3 grid grid-cols-2 gap-y-4"><SummaryMetric icon={<Users className="h-3.5 w-3.5" />} label="Sessions" value={sessionCount.toString()} /><SummaryMetric icon={<Clock3 className="h-3.5 w-3.5" />} label="Practice time" value={formatPractice} /><SummaryMetric icon={<AudioLines className="h-3.5 w-3.5" />} label="Speaking rate" value={pace !== null ? `${pace} WPM` : "â€”"} /><SummaryMetric icon={<BarChart2 className="h-3.5 w-3.5" />} label="Average score" value={score !== null ? `${score} / 100` : "â€”"} /></div></div>

      <div className="rounded-[18px] border border-[#ddd3f8] bg-[#f1eefe] p-4 shadow-[0_4px_14px_rgba(42,35,55,0.04)] md:col-span-12"><div className="flex items-center justify-between gap-5"><div className="flex items-start gap-3"><IconCircle icon={<Lightbulb className="h-4 w-4" />} /><div><p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#7c6fea]">Key insight</p><h2 className="mt-1 text-[17px] font-medium tracking-[-0.03em] text-[#24232b]">{trend.length > 1 ? "Your communication baseline is starting to take shape." : "Your communication story starts here."}</h2><p className="mt-1 text-[12px] text-[#5b5b6b]">Keep practicing to give Aynam more signal about your communication habits.</p></div></div><Link href="/insights?tab=patterns" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d7ccfa] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6754aa]">View detailed patterns <ArrowRight className="h-3.5 w-3.5" /></Link></div></div>
    </section>
  );
}

function IconCircle({ icon }: { icon: ReactNode }) { return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2eeff] text-[#8067d6]">{icon}</div>; }

function Observation({ label, item, description, icon, tone, badge, className = "" }: { label: string; item: { label: string; value: number } | null; description: string; icon: ReactNode; tone: string; badge: string; className?: string }) {
  return <div className={`rounded-[18px] border border-[rgba(36,35,43,0.08)] p-4 shadow-[0_4px_14px_rgba(42,35,55,0.04)] ${tone} ${className}`}><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><IconCircle icon={icon} /><p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#7b8192]">{label}</p></div><span className={`rounded-full px-2 py-0.5 text-[9px] ${label === "Strongest" ? "bg-[#dff5e3] text-[#1e8a4c]" : "bg-[#fce7e8] text-[#c4453e]"}`}>{badge}</span></div><h3 className="mt-3 text-[24px] font-medium tracking-[-0.06em] text-[#24232b]">{item?.label ?? "Still forming"}</h3><p className="mt-1 text-[18px] text-[#24232b]">{item ? `${Math.round(item.value)} / 100` : "â€”"}</p><p className="mt-2 max-w-sm text-[12px] leading-5 text-[#5b5b6b]">{item ? description : "More sessions will give Aynam enough signal to make this observation."}</p></div>;
}

function SummaryMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="min-w-0 border-r border-[rgba(36,35,43,0.12)] px-2.5 last:border-0"><div className="flex items-center gap-1.5 text-[#687184]"><span>{icon}</span><p className="text-[16px] font-semibold text-[#24232b]">{value}</p></div><p className="mt-1 text-[10px] text-[#7b8192]">{label}</p></div>;
}

function CommunicationChart({ points }: { points: Array<{ label: string; score: number }> }) {
  const svgWidth = 520;
  const svgHeight = 150;
  const padding = 20;
  const min = 0;
  const max = 100;

  const path = points
    .map((point, index) => {
      const x = padding + (index * (svgWidth - padding * 2)) / Math.max(points.length - 1, 1);
      const y = svgHeight - padding - ((point.score - min) / Math.max(max - min, 1)) * (svgHeight - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-[130px] w-full" role="img" aria-label="Communication score over time">
      <g>
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = svgHeight - padding - (tick / 100) * (svgHeight - padding * 2);
          return <line key={tick} x1={padding} x2={svgWidth - padding} y1={y} y2={y} stroke="#E7E1F3" strokeDasharray="4 7" />;
        })}
      </g>
      <path d={path} fill="none" stroke="#8067D6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => {
        const x = padding + (index * (svgWidth - padding * 2)) / Math.max(points.length - 1, 1);
        const y = svgHeight - padding - ((point.score - min) / Math.max(max - min, 1)) * (svgHeight - padding * 2);
        return <circle key={`${point.label}-${index}`} cx={x} cy={y} r="4" fill="#fff" stroke="#8067D6" strokeWidth="2" />;
      })}
    </svg>
  );
}

function PatternsView({ pacePoints, paceTrend, averagePace, fillerTotal, fillerWords, fillerTrend, sentenceAverage, utilizationRatio, totalSpeakingSeconds, totalElapsedSeconds, topTopics, visible }: {
  pacePoints: Array<{ label: string; value: number }>;
  paceTrend: Trend;
  averagePace: number | null;
  fillerTotal: number;
  fillerWords: Array<[string, number]>;
  fillerTrend: Trend;
  sentenceAverage: number | null;
  utilizationRatio: number | null;
  totalSpeakingSeconds: number;
  totalElapsedSeconds: number;
  topTopics: [string, number][];
  visible: Session[];
}) {
  const ratio = utilizationRatio === null ? null : Math.round(utilizationRatio * 100);
  const paceText = paceTrend === "steady" ? "Your speaking pace has been fairly consistent across recent sessions." : paceTrend === "up" ? "Your speaking pace has been trending higher across recent sessions." : paceTrend === "down" ? "Your speaking pace has been trending lower across recent sessions." : "More sessions will help Aynam identify a pace pattern.";
  const fillerText = fillerTrend === "down" ? "Youâ€™re using fewer filler words compared to earlier sessions." : fillerTotal > 0 ? "Aynam is still learning how your filler words are changing." : "No filler words have been detected in this range.";
  const sentenceText = sentenceAverage === null ? "More speech will help establish your sentence style." : sentenceAverage < 8 ? "Your sentences tend to stay concise." : sentenceAverage <= 14 ? "Your sentences tend to stay relatively concise." : "Your sentences tend to include more detail.";
  return (
    <section className="mt-4 grid gap-3 md:grid-cols-12">
      <PatternCard className="md:col-span-8" icon={<AudioLines className="h-4 w-4" />} title="Speaking pace" meta={`${visible.length} sessions`} description="Your average speaking rate across all sessions."><div className="grid items-center gap-4 md:grid-cols-[0.45fr_1.55fr]"><div><div className="text-[34px] font-bold tracking-[-0.07em] text-[#1a1a2e]">{averagePace === null ? "â€”" : `${Math.round(averagePace)} WPM`}</div><span className="mt-2 inline-flex rounded-full bg-[#f1eefe] px-2.5 py-1 text-[10px] text-[#7c6fea]">{paceTrend === "unknown" ? "Not enough sessions to compare" : paceTrend === "steady" ? "Steady pace" : paceTrend === "up" ? "Speeding up" : "Slowing down"}</span></div>{pacePoints.length > 1 ? <PaceChart points={pacePoints} /> : <p className="text-[12px] text-[#687184]">Complete more sessions to see your trend.</p>}</div><InsightStrip text={paceText} /></PatternCard>
      <PatternCard className="md:col-span-4" icon={<MessageSquare className="h-4 w-4" />} title="Filler words" badge={fillerTrendLabel(fillerTrend)} description={`You used ${fillerTotal} filler words across all sessions.`}><div className="min-h-[90px]">{fillerWords.length ? <div className="space-y-2">{fillerWords.map(([word, count]) => <div key={word} className="flex items-center gap-2 text-[12px]"><span className="w-14 text-[#24232b]">{word}</span><div className="h-1.5 flex-1 rounded-full bg-[#e7e3fa]"><div className="h-full rounded-full bg-[#7c6fea]" style={{ width: `${(count / fillerWords[0][1]) * 100}%` }} /></div><span className="w-4 text-right text-[#5b5b6b]">{count}</span></div>)}</div> : <p className="text-[12px] text-[#687184]">No filler words detected in this range.</p>}</div><InsightStrip text={fillerText} /></PatternCard>
      <PatternCard className="md:col-span-4" icon={<FileText className="h-4 w-4" />} title="Sentence style" description={sentenceAverage === null ? "Average sentence length is not available yet." : "Your average sentence length is"}><div className="text-[30px] font-bold tracking-[-0.07em] text-[#1a1a2e]">{sentenceAverage === null ? "â€”" : `${Math.round(sentenceAverage)} words`}</div><SentenceScale value={sentenceAverage ?? 0} /><InsightStrip text={sentenceText} /></PatternCard>
      <PatternCard className="md:col-span-4" icon={<PieChart className="h-4 w-4" />} title="Speaking utilization" description="How much of your recorded practice contained detected speech."><div className="flex items-baseline gap-2"><span className="text-[30px] font-bold tracking-[-0.07em] text-[#1a1a2e]">{totalSpeakingSeconds > 0 ? `${Math.round(totalSpeakingSeconds)} sec` : "â€”"}</span><span className="text-[12px] text-[#687184]">of {totalElapsedSeconds > 0 ? `${Math.round(totalElapsedSeconds)} sec` : "â€”"}</span></div><div className="mt-4 flex items-center gap-2"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e7e3fa]"><div className="h-full rounded-full bg-[#7c6fea]" style={{ width: `${ratio ?? 0}%` }} /></div><span className="text-[12px] text-[#5b5b6b]">{ratio === null ? "â€”" : `${ratio}%`}</span></div><InsightStrip text={ratio === null ? "Not enough duration data yet." : `You spoke for ${ratio}% of your recorded time.`} /></PatternCard>
      <PatternCard className="md:col-span-4" icon={<BookOpen className="h-4 w-4" />} title="Topics youâ€™ve practiced" description={`${topTopics.length} topics identified across ${visible.length} sessions.`}><div className="min-h-[90px] space-y-2">{topTopics.length ? topTopics.map(([topic, count]) => <div key={topic} className="flex items-center gap-2 text-[12px]"><span className="min-w-0 flex-1 truncate text-[#24232b]">{topic}</span><div className="h-1.5 w-16 rounded-full bg-[#e7e3fa]"><div className="h-full rounded-full bg-[#7c6fea]" style={{ width: `${(count / topTopics[0][1]) * 100}%` }} /></div><span className="w-3 text-right text-[#5b5b6b]">{count}</span></div>) : <p className="text-[12px] text-[#687184]">Topics will appear as they are persisted with your sessions.</p>}</div><InsightStrip text={topTopics.length < 3 ? "More topics will appear as you practice." : "Your practice topics are beginning to form a useful range."} /></PatternCard>
      <div className="rounded-[18px] border border-[#ddd3f8] bg-[#f1eefe] p-4 shadow-sm md:col-span-12"><div className="flex items-center justify-between gap-4"><div className="flex items-start gap-3"><IconCircle icon={<Star className="h-4 w-4" />} /><div><p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#7c6fea]">What weâ€™re noticing</p><h2 className="mt-1.5 text-[17px] font-semibold tracking-[-0.03em] text-[#24232b]">{paceText}</h2><p className="mt-1 text-[12px] text-[#5b5b6b]">Keep practicing to give Aynam more signal about your communication habits.</p></div></div><Link href="/insights?tab=recommendations" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#d7ccfa] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6754aa]">View recommendations <ArrowRight className="h-3.5 w-3.5" /></Link></div></div>
    </section>
  );
}

function PatternCard({ className, icon, title, meta, badge, description, children }: { className: string; icon: ReactNode; title: string; meta?: string; badge?: string | null; description: string; children: ReactNode }) { return <article className={`flex min-h-[230px] flex-col rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm ${className}`}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2.5"><IconCircle icon={icon} /><h2 className="text-[15px] font-semibold text-[#1a1a2e]">{title}</h2></div>{badge ? <span className="rounded-full bg-[#e7f7ea] px-2 py-1 text-[10px] text-[#1e8a4c]">â†“ {badge}</span> : meta ? <span className="text-[10px] text-[#9797a6]">{meta}</span> : null}</div><p className="mt-2 text-[12px] leading-4 text-[#5b5b6b]">{description}</p><div className="mt-4 flex-1">{children}</div></article>; }

function InsightStrip({ text }: { text: string }) { return <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f1eefe] px-3 py-2 text-[11px] text-[#5b5b6b]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e7e3fa] text-[#7c6fea]"><Lightbulb className="h-3 w-3" /></span><span>{text}</span></div>; }

function ProgressView({ trend, profile, sessions, recentSessions }: { trend: Array<{ label: string; score: number; session: number }>; profile: Array<{ label: string; first: number | null; latest: number | null; change: number | null }>; sessions: Session[]; recentSessions: Session[] }) {
  const firstScore = trend[0]?.score ?? null;
  const latestScore = trend[trend.length - 1]?.score ?? null;
  const overallChange = firstScore !== null && latestScore !== null && trend.length > 1 ? Math.round(latestScore - firstScore) : null;
  const keyImprovement = profile.filter((item): item is typeof item & { change: number } => item.change !== null && item.change > 0).sort((a, b) => b.change - a.change)[0] ?? null;
  const milestone = latestScore !== null ? (latestScore < 60 ? 60 : Math.ceil((latestScore + 1) / 10) * 10) : null;
  const milestoneGap = milestone !== null && latestScore !== null ? Math.max(0, milestone - latestScore) : null;
  const recent = [...recentSessions].reverse().slice(0, 4);
  const headline = overallChange === null ? "Your baseline is ready." : overallChange > 0 ? "Youâ€™re making progress." : overallChange < 0 ? "Your recent sessions look a little different." : "Youâ€™re holding steady.";
  const summary = overallChange === null ? "Complete another session to start seeing your progress." : overallChange > 0 ? `You've completed ${sessions.length} sessions. Your overall score has improved by ${overallChange} points since your first session.` : overallChange < 0 ? `You've completed ${sessions.length} sessions. Your overall score has changed by ${Math.abs(overallChange)} points since your first session.` : `You've completed ${sessions.length} sessions. Your overall score has stayed about the same since your first session.`;
  return (
    <section className="mt-4 space-y-3">
      <div className="flex items-center justify-between gap-5 rounded-[18px] border border-[#ddd3f8] bg-[#f1eefe] px-4 py-3 shadow-sm"><div className="flex min-w-0 items-center gap-3"><IconCircle icon={<BarChart2 className="h-4 w-4" />} /><div><h2 className="text-[16px] font-semibold text-[#24232b]">{headline}</h2><p className="mt-0.5 text-[12px] text-[#5b5b6b]">{summary}</p></div></div><div className="flex shrink-0 items-center gap-4"><MiniSparkline points={trend} />{overallChange !== null ? <span className={`text-[18px] font-semibold ${overallChange > 0 ? "text-[#1e8a4c]" : "text-[#7c6fea]"}`}>{overallChange > 0 ? "+" : ""}{overallChange}</span> : null}</div></div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-[16px] font-semibold text-[#1a1a2e]">Overall score trend</h2><p className="mt-1 text-[12px] text-[#5b5b6b]">Your communication score across sessions.</p></div><div className="text-right"><span className="text-[10px] text-[#9797a6]">{trend.length} sessions</span>{overallChange !== null ? <p className={`mt-1 text-[11px] font-medium ${overallChange >= 0 ? "text-[#1e8a4c]" : "text-[#c4453e]"}`}>{overallChange >= 0 ? "â†— +" : "â†˜ "}{Math.abs(overallChange)} points</p> : null}</div></div>{trend.length > 1 ? <ProgressScoreChart points={trend} /> : <p className="mt-8 rounded-xl bg-[#f1eefe] p-3 text-[12px] text-[#687184]">Complete another session to see your trend.</p>}</article>
        <article className="rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2.5"><IconCircle icon={<Target className="h-4 w-4" />} /><div><h2 className="text-[16px] font-semibold text-[#1a1a2e]">Progress by skill</h2><p className="mt-1 text-[12px] text-[#5b5b6b]">Change from your first to latest session.</p></div></div><div className="hidden items-center gap-2 text-[10px] text-[#9797a6] sm:flex"><span>â—‹ First</span><span className="text-[#7c6fea]">â— Latest</span></div></div><div className="mt-3 divide-y divide-[#ecebf3]">{profile.map((item) => <SkillProgressRow key={item.label} item={item} />)}</div></article>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-[16px] font-semibold text-[#1a1a2e]">Recent sessions</h2><Link href="/history" className="inline-flex items-center gap-1 text-[12px] font-medium text-[#7c6fea]">View all <ArrowRight className="h-3.5 w-3.5" /></Link></div><div className="mt-2 divide-y divide-[#ecebf3]">{recent.map((session) => <Link key={session.id} href="/history" className="flex items-center justify-between gap-3 py-2 text-[12px]"><span className="w-[86px] shrink-0 text-[#9797a6]">{new Date(session.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span><span className="min-w-0 flex-1 truncate text-[#24232b]">{session.topic?.trim() || "Practice session"}</span><span className="rounded-full bg-[#f1eefe] px-2.5 py-1 font-semibold text-[#6754aa]">{getCommunicationScore(session.feedback) === null ? "â€”" : Math.round(getCommunicationScore(session.feedback) as number)}</span><ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#9797a6]" /></Link>)}</div></article>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><article className="rounded-2xl border border-[#dfeee2] bg-[#eaf7ec] p-4 shadow-sm"><p className="text-[12px] font-medium text-[#1e8a4c]">Key improvement</p><h2 className="mt-2 text-[22px] font-semibold tracking-[-0.05em] text-[#24232b]">{keyImprovement?.label ?? "Still forming"}</h2><p className="mt-1 text-[18px] text-[#1e8a4c]">{keyImprovement ? `+${keyImprovement.change} points` : "Not enough data"}</p><p className="mt-2 text-[12px] leading-4 text-[#687184]">{keyImprovement ? `You&apos;re expressing your ${keyImprovement.label.toLowerCase()} more clearly than in your first session.` : "Complete more sessions to identify a clear improvement."}</p></article><article className="rounded-2xl border border-[#ecebf3] bg-[#f1eefe] p-4 shadow-sm"><p className="text-[12px] font-medium text-[#7c6fea]">Next milestone</p><h2 className="mt-2 text-[18px] font-semibold text-[#24232b]">{milestone === null ? "Build your baseline" : `Reach ${milestone} overall`}</h2>{milestone !== null && latestScore !== null ? <><div className="mt-2 flex items-center justify-between gap-2 text-[12px] text-[#687184]"><span>{latestScore} / {milestone}</span><span>{milestoneGap === 0 ? "Reached" : `${milestoneGap} to go`}</span></div><div className="mt-2 h-1.5 rounded-full bg-[#e7e3fa]"><div className="h-full rounded-full bg-[#7c6fea]" style={{ width: `${Math.min(100, (latestScore / milestone) * 100)}%` }} /></div><p className="mt-2 text-[11px] text-[#687184]">{milestoneGap === 0 ? "Milestone reached." : `Just ${milestoneGap} more points to reach ${milestone}.`}</p></> : <p className="mt-2 text-[12px] text-[#687184]">More sessions will set your next milestone.</p>}</article></div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[#ddd3f8] bg-[#f1eefe] px-4 py-3 shadow-sm"><div className="flex items-center gap-3"><IconCircle icon={<Sparkles className="h-4 w-4" />} /><div><h2 className="text-[16px] font-semibold text-[#24232b]">Keep going</h2><p className="mt-1 text-[12px] text-[#24232b]">Progress isn&apos;t about perfection, it&apos;s about consistency.</p><p className="mt-0.5 text-[11px] text-[#687184]">Every session helps you communicate with more clarity and confidence.</p></div></div><Link href="/practice" className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#7c6fea] px-3 py-2 text-[12px] font-medium text-white">Start a new session <ArrowRight className="h-3.5 w-3.5" /></Link></div>
    </section>
  );
}

const recommendationCopy: Record<string, { headline: string; description: string; why: Record<"up" | "down" | "steady", string>; quotes: string[] }> = {
  Structure: { headline: "Structure your answers more clearly.", description: "Your recent sessions show strong ideas. Giving them a clearer beginning, middle, and close will make longer answers easier to follow.", why: { up: "Your structure is improving, and a little more consistency will make that progress stick.", down: "Your longer answers vary in organization, so this is the clearest opportunity to grow.", steady: "Your longer answers still vary in organization, which makes structure a useful next focus." }, quotes: ["Good structure makes your ideas easier to follow and more memorable.", "A clear point gives every strong answer somewhere to go."] },
  Clarity: { headline: "Make your main idea easier to hear.", description: "You have useful ideas to share. Lead with your point and keep the supporting detail focused so listeners can follow quickly.", why: { up: "Your clarity is moving in the right direction; practicing direct openings can reinforce it.", down: "Your ideas sometimes take a little too long to land, making clarity the best next focus.", steady: "A more direct opening will help your ideas land with less effort." }, quotes: ["The clearest message is often the one that gets to the point kindly.", "Simple language gives good ideas room to shine."] },
  Fluency: { headline: "Build a smoother, steadier delivery.", description: "Your message matters. A calmer rhythm and intentional pauses can help it come across with more ease.", why: { up: "Your delivery is becoming smoother; short, regular drills can build on that momentum.", down: "Your delivery varies from session to session, so fluency offers the most room for growth.", steady: "A steadier speaking rhythm will help your ideas feel more natural." }, quotes: ["A thoughtful pause can make a strong idea feel even stronger.", "Ease comes from repetition, not rushing."] },
  Confidence: { headline: "Let your ideas land with more confidence.", description: "You have something worth saying. Practice stating your point with a steady start and a clear finish.", why: { up: "Your confidence is building; repeating that steadiness in new situations will help it last.", down: "Your delivery is less assured in recent sessions, making confidence a valuable next focus.", steady: "A steadier start will help your delivery feel more assured." }, quotes: ["Confidence is clarity you can hear.", "You do not need to be loud to sound certain."] },
  Vocabulary: { headline: "Choose words that make your meaning precise.", description: "Your ideas will feel even stronger when your word choice is specific, natural, and easy to understand.", why: { up: "Your word choice is improving; trying new language in context will strengthen it further.", down: "Your recent sessions leave room for more precise language, making vocabulary a useful focus.", steady: "More precise word choices can make your strongest ideas even sharper." }, quotes: ["The right word makes a good idea easier to remember.", "Precise language creates connection, not distance."] },
  Presence: { headline: "Bring more presence to each answer.", description: "Give your ideas a moment to land by speaking with steady energy and attention.", why: { up: "Your presence is growing; keep practicing in a range of situations.", down: "Your recent delivery shows an opportunity to build a more consistent presence.", steady: "More steady presence can help your message feel more engaging." }, quotes: ["Presence is the feeling that you are fully with your listener.", "Your attention is part of your message."] },
};

const frameworkSteps = [["1", "Point", "Start with your main idea"], ["2", "Reason", "Explain why it matters"], ["3", "Example", "Give a real example"], ["4", "Close", "End with a quick summary"]] as const;
const practicePlan = [["01", "Get structured", "Use a clear framework"], ["02", "Make it natural", "Practice in real scenarios"], ["03", "Make it effortless", "Apply it in longer answers"]] as const;
const dimensionPills: Record<string, string> = { Structure: "bg-[#FBE4C8] text-[#B5651D]", Clarity: "bg-[#E9EAF5] text-[#4B5170]", Fluency: "bg-[#f1eefe] text-[#6754aa]", Confidence: "bg-[#FCE7E8] text-[#b84e63]", Vocabulary: "bg-[#eaf7ec] text-[#1e8a4c]", Presence: "bg-[#E9EAF5] text-[#4B5170]" };

function RecommendationsView({ focus, progressSkills, sessionCount }: { focus: { label: string; value: number } | null; progressSkills: Array<{ label: string; first: number | null; latest: number | null; change: number | null }>; sessionCount: number }) {
  const hasEvidence = focus !== null && sessionCount >= 2;
  const copy = focus ? recommendationCopy[focus.label] : null;
  const delta = focus ? progressSkills.find((item) => item.label === focus.label)?.change ?? null : null;
  const trend: "up" | "down" | "steady" = delta === null || delta === 0 ? "steady" : delta > 0 ? "up" : "down";
  const pill = focus ? dimensionPills[focus.label] : "bg-[#f1eefe] text-[#6754aa]";
  const onboarding = "Complete another session to get personalized recommendations.";

  return <section className="mt-4 space-y-3 pb-4">
    <article className="grid gap-3 rounded-[20px] border border-[#ddd3f8] bg-[#f3f0ff] p-4 shadow-sm lg:grid-cols-[1.15fr_.9fr_.42fr]">
      <div><div className="flex items-center gap-2"><IconCircle icon={<Target className="h-4 w-4" />} /><p className="text-[10px] font-medium uppercase tracking-[.16em] text-[#7b8192]">Your next focus</p></div><h2 className="mt-3 text-[25px] font-semibold tracking-[-.05em] text-[#171722]">{hasEvidence && copy ? copy.headline : "Your recommendations are taking shape."}</h2><p className="mt-2 max-w-xl text-[13px] leading-5 text-[#667085]">{hasEvidence && copy ? copy.description : onboarding}</p><Link href={hasEvidence ? `/practice?dimension=${focus?.label.toLowerCase()}` : "/practice"} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#7b68d8] px-3 py-2 text-[12px] font-medium text-white">Practice this <ArrowRight className="h-3.5 w-3.5" /></Link></div>
      <div className="rounded-[16px] border border-[#e3ddfa] bg-white/80 p-4"><p className="text-[10px] font-medium uppercase tracking-[.14em] text-[#7b8192]">Try a simple framework</p><div className="mt-3 space-y-2">{frameworkSteps.map(([number, title, text]) => <div key={number} className="grid grid-cols-[16px_50px_1fr] gap-2 text-[12px]"><span className="font-medium text-[#7b68d8]">{number}</span><strong>{title}</strong><span className="text-[#667085]">{text}</span></div>)}</div></div>
      <aside className="relative min-h-[150px] rotate-[3deg] rounded-lg bg-[var(--sticky-note-bg)] p-4 shadow-[0_7px_14px_rgba(88,72,35,.12)]"><FileText className="h-4 w-4 text-[#7b68d8]" /><Sparkles className="absolute right-3 top-3 h-4 w-4 text-[#7b68d8]/50" /><p className="mt-5 text-[14px] font-medium leading-5 text-[#403d35]">Clear answers create stronger conversations.</p></aside>
    </article>
    <div className="grid gap-3 lg:grid-cols-[1.05fr_.85fr_1.1fr]">
      <article className="rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm"><div className="flex items-center gap-2"><IconCircle icon={<Lightbulb className="h-4 w-4" />} /><h2 className="text-[16px] font-semibold">Why this?</h2></div><p className="mt-3 text-[12px] leading-5 text-[#667085]">{hasEvidence && copy ? copy.why[trend] : onboarding}</p>{hasEvidence && focus ? <div className="mt-3 flex items-end justify-between border-t border-[#ecebf3] pt-3"><div><p className="text-[11px] text-[#667085]">{focus.label}</p><strong className="text-[21px] tracking-[-.04em]">{Math.round(focus.value)} <span className="text-[12px] font-normal text-[#9797a6]">/ 100</span></strong></div><div className="text-right">{delta !== null ? <span className={delta >= 0 ? "rounded-full bg-[#eaf7ec] px-2 py-1 text-[11px] font-semibold text-[#1e8a4c]" : "rounded-full bg-[#FCE7E8] px-2 py-1 text-[11px] font-semibold text-[#b84e63]"}>{delta >= 0 ? "â†— +" : "â†˜ "}{delta} pts</span> : <span className="text-[11px] text-[#9797a6]">Building baseline</span>}<p className="mt-1 text-[10px] text-[#9797a6]">since your first session</p></div></div> : null}</article>
      <article className="rounded-2xl border border-[#f4dfc5] bg-[var(--orange-tint-bg)] p-4 shadow-sm"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--orange-badge-bg)] text-[var(--orange-badge-text)]"><BarChart2 className="h-4 w-4" /></span><h2 className="text-[16px] font-semibold">Your current priority</h2></div><h3 className="mt-4 text-[22px] font-semibold tracking-[-.05em]">{hasEvidence ? focus?.label : "Still forming"}</h3><p className="mt-1 text-[14px] text-[#667085]">{hasEvidence ? `${Math.round(focus?.value ?? 0)} / 100` : "More evidence needed"}</p><p className="mt-3 text-[11px] leading-4 text-[#667085]">This is the area with the most opportunity for growth right now.</p></article>
      <article className="rounded-2xl border border-[#ddd3f8] bg-[#f7f5ff] p-4 shadow-sm"><div className="flex items-center gap-2"><IconCircle icon={<Sparkles className="h-4 w-4" />} /><h2 className="text-[16px] font-semibold">Quick note</h2></div><p className="mt-5 text-[17px] font-medium italic leading-6 tracking-[-.03em]">â€œ{hasEvidence && copy ? copy.quotes[0] : "Every practice session gives you a clearer picture of your communication."}â€</p><p className="mt-3 text-[11px] text-[#7b8192]">â€” Aynam</p></article>
    </div>
    <section className="rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm"><div className="flex items-end justify-between"><div><div className="flex items-center gap-2"><Play className="h-4 w-4 text-[#7b68d8]" /><h2 className="text-[18px] font-semibold">Practice this</h2></div><p className="mt-1 text-[12px] text-[#667085]">Short, focused exercises to help you improve.</p></div><span className="text-[12px] font-medium text-[#7b68d8]">View all exercises â†’</span></div><div className="mt-3 rounded-xl border border-dashed border-[#dcd7e7] bg-[#fcfbfe] px-4 py-5 text-center text-[12px] text-[#667085]">Personalized exercises will appear here when an exercises library is available.</div></section>
    <div className="grid gap-3 lg:grid-cols-[1.85fr_1fr]"><section className="rounded-2xl border border-[#ecebf3] bg-white p-4 shadow-sm"><div className="flex items-center gap-2"><IconCircle icon={<ListChecks className="h-4 w-4" />} /><h2 className="text-[18px] font-semibold">A simple practice plan</h2></div><p className="mt-1 text-[12px] text-[#667085]">Follow this 3-step plan to build clearer, more confident communication.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{practicePlan.map(([number, title, text], index) => <div key={number} className="relative flex gap-2"><span className="text-[12px] font-medium text-[#7b68d8]">{number}</span><div><h3 className="text-[12px] font-semibold">{title}</h3><p className="mt-1 text-[11px] leading-4 text-[#667085]">{text}</p></div>{index < 2 ? <ArrowRight className="absolute -right-2 top-2 hidden h-3 w-3 text-[#c6bfd9] sm:block" /> : null}</div>)}</div></section><section className="flex flex-col rounded-2xl border border-[#ddd3f8] bg-[#f3f0ff] p-4 shadow-sm"><div className="flex items-center gap-2"><IconCircle icon={<Flag className="h-4 w-4" />} /><h2 className="text-[16px] font-semibold">Your next session</h2></div><p className="mt-4 text-[14px] font-medium leading-5">A personalized session will be suggested when session prompts are available.</p>{hasEvidence ? <span className={`mt-3 w-fit rounded-full px-2 py-1 text-[11px] font-medium ${pill}`}>{focus?.label}</span> : null}<Link href="/practice" className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#7b68d8] px-3 py-2 text-[12px] font-medium text-white">Start session <ArrowRight className="h-3.5 w-3.5" /></Link></section></div>
  </section>;
}


function MiniSparkline({ points }: { points: Array<{ score: number }> }) {
  if (points.length < 2) return null;
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${index * (100 / (points.length - 1))} ${34 - (point.score / 100) * 25}`).join(" ");
  return <svg viewBox="0 0 100 40" className="h-10 w-28" aria-label="Progress sparkline"><path d={`${path} L 100 40 L 0 40 Z`} fill="#e7e3fa" opacity="0.7" /><path d={path} fill="none" stroke="#7c6fea" strokeWidth="1.8" strokeLinecap="round" />{points.slice(-2).map((point, index) => <circle key={`${point.score}-${index}`} cx={(points.length - 2 + index) * (100 / (points.length - 1))} cy={34 - (point.score / 100) * 25} r="2" fill="#7c6fea" />)}</svg>;
}

function ProgressScoreChart({ points }: { points: Array<{ label: string; score: number; session: number }> }) {
  const width = 520;
  const height = 150;
  const left = 28;
  const right = 12;
  const top = 18;
  const bottom = 32;
  const x = (index: number) => left + (index * (width - left - right)) / Math.max(points.length - 1, 1);
  const y = (score: number) => top + ((100 - score) / 100) * (height - top - bottom);
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.score)}`).join(" ");
  const areaPath = `${path} L ${x(points.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  return <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-[145px] w-full" role="img" aria-label="Overall score trend"><g>{[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} stroke="#ecebf3" /><text x="0" y={y(tick) + 3} fontSize="9" fill="#9797a6">{tick}</text></g>)}</g><path d={areaPath} fill="#f1eefe" opacity="0.8" /><path d={path} fill="none" stroke="#7c6fea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />{points.map((point, index) => { const scoreY = y(point.score); const labelY = scoreY - (index % 2 === 0 ? 11 : 22); return <g key={`${point.session}-${point.label}`}><circle cx={x(index)} cy={scoreY} r="4" fill={index === points.length - 1 ? "#7c6fea" : "#fff"} stroke="#7c6fea" strokeWidth="2" /><rect x={x(index) - 11} y={labelY - 9} width="22" height="12" rx="4" fill="#fff" opacity="0.9" /><text x={x(index)} y={labelY} textAnchor="middle" fontSize="9" fontWeight="600" fill="#24232b">{Math.round(point.score)}</text><text x={x(index)} y={height - 16} textAnchor="middle" fontSize="9" fill="#24232b">Session {point.session}</text><text x={x(index)} y={height - 4} textAnchor="middle" fontSize="9" fill="#9797a6">{point.label}</text></g>; })}</svg>;
}

function SkillProgressRow({ item }: { item: { label: string; first: number | null; latest: number | null; change: number | null } }) {
  if (item.change === null || item.first === null || item.latest === null) return <div className="flex items-center justify-between border-b border-[#ecebf3] py-2 text-[12px]"><span className="text-[#24232b]">{item.label}</span><span className="text-[#9797a6]">â€”</span></div>;
  const start = Math.min(item.first, item.latest);
  const end = Math.max(item.first, item.latest);
  return <div className="grid grid-cols-[68px_1fr_30px] items-center gap-2 border-b border-[#ecebf3] py-2 text-[12px]"><span className="text-[#5b5b6b]">{item.label}</span><div className="relative h-7"><div className="absolute left-0 right-0 top-[60%] h-px bg-[#e7e3fa]" /><div className="absolute top-[60%] h-px bg-[#7c6fea]" style={{ left: `${start}%`, width: `${end - start}%` }} /><span className="absolute top-[60%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c6fea] bg-white" style={{ left: `${item.first}%` }} /><span className="absolute top-[60%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7c6fea]" style={{ left: `${item.latest}%` }} /><span className="absolute top-0 text-[9px] text-[#9797a6]" style={{ left: `${item.first}%`, transform: "translateX(-50%)" }}>{item.first}</span><span className="absolute top-0 text-[9px] font-semibold text-[#24232b]" style={{ left: `${item.latest}%`, transform: "translateX(-50%)" }}>{item.latest}</span></div><span className={item.change > 0 ? "text-right font-medium text-[#1e8a4c]" : item.change < 0 ? "text-right font-medium text-[#c4453e]" : "text-right text-[#9797a6]"}>{item.change > 0 ? "+" : ""}{item.change}</span></div>;
}
function PaceChart({ points }: { points: Array<{ label: string; value: number }> }) {
  const svgWidth = 420;
  const svgHeight = 120;
  const padding = 22;
  const max = Math.max(Math.ceil(Math.max(...points.map((point) => point.value), 1) / 50) * 50 + 50, 50);

  const path = points
    .map((point, index) => {
      const x = padding + (index * (svgWidth - padding * 2)) / Math.max(points.length - 1, 1);
      const y = svgHeight - padding - (point.value / max) * (svgHeight - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-[120px] w-full" role="img" aria-label="Speaking pace chart">
      <g>
        {[0, max / 4, max / 2, (max * 3) / 4, max].map((tick) => {
          const y = svgHeight - padding - (tick / max) * (svgHeight - padding * 2);
          return <g key={tick}><line x1={padding} x2={svgWidth - padding} y1={y} y2={y} stroke="#ecebf3" strokeDasharray="3 7" /><text x="2" y={y + 3} fontSize="8" fill="#9797a6">{Math.round(tick)}</text></g>;
        })}
      </g>
      <path d={path} fill="none" stroke="#7c6fea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => {
        const x = padding + (index * (svgWidth - padding * 2)) / Math.max(points.length - 1, 1);
        const y = svgHeight - padding - (point.value / max) * (svgHeight - padding * 2);
        const latest = index === points.length - 1;
        return <g key={`${point.label}-${index}`}><circle cx={x} cy={y} r="3.5" fill="#7c6fea" stroke="#fff" strokeWidth="1.5" />{latest ? <><rect x={Math.max(4, x - 30)} y={Math.max(2, y - 34)} width="60" height="25" rx="6" fill="#fff" stroke="#ecebf3" /><text x={x} y={Math.max(12, y - 22)} textAnchor="middle" fontSize="8" fill="#1a1a2e">{point.label}</text><text x={x} y={Math.max(21, y - 12)} textAnchor="middle" fontSize="8" fill="#7c6fea">{Math.round(point.value)} WPM</text></> : null}</g>;
      })}
      {points.map((point, index) => { const x = padding + (index * (svgWidth - padding * 2)) / Math.max(points.length - 1, 1); return <text key={`${point.label}-${index}-label`} x={x} y={svgHeight - 3} textAnchor="middle" fontSize="8" fill="#9797a6">{point.label}</text>; })}
    </svg>
  );
}

function SentenceScale({ value }: { value: number }) {
  const width = Math.min(100, Math.max(0, ((value - 5) / 20) * 100));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[11px] text-[#6F6A78]">
        <span><strong>Shorter</strong><br /><small>(clearer)</small></span>
        <span className="text-right"><strong>Longer</strong><br /><small>(more detail)</small></span>
      </div>
      <div className="relative h-[8px] rounded-full bg-[#E7E3FA]">
        <div className="h-full rounded-full bg-[#7C6FEA]" style={{ width: `${width}%` }} />
        {value > 0 ? <span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-[#7C6FEA] bg-white" style={{ left: `${width}%` }} /> : null}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <main className="min-h-full bg-[#FFFDF8] px-5 py-8 sm:px-10">
      <div className="mx-auto max-w-[1180px] animate-pulse">
        <div className="h-3 w-16 rounded bg-[#E7E1F1]" />
        <div className="mt-5 h-9 w-56 rounded bg-[#F0ECF7]" />
        <div className="mt-8 h-72 rounded-[18px] bg-[#F0ECF7]" />
        <div className="mt-10 h-48 rounded-[16px] bg-[#F5F1FF]" />
      </div>
    </main>
  );
}

function StateMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="flex min-h-full items-center justify-center bg-[#FFFDF8] px-6">
      <div className="max-w-sm border border-[rgba(40,35,50,0.08)] bg-white p-8 text-center shadow-[0_10px_24px_rgba(28,22,32,0.04)]">
        <h1 className="text-lg font-semibold text-[#1F1E26]">Unable to load insights</h1>
        <p className="mt-3 text-sm leading-6 text-[#665f66]">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 bg-[#8067D6] px-4 py-2 text-xs font-semibold text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </main>
  );
}

function EmptyState({ hasSessions }: { hasSessions: boolean }) {
  return (
    <main className="flex min-h-full items-center justify-center bg-[#FFFDF8] px-6">
      <div className="max-w-sm border border-[rgba(40,35,50,0.08)] bg-white p-9 text-center shadow-[0_10px_24px_rgba(28,22,32,0.04)]">
        <h1 className="text-lg font-semibold text-[#1F1E26]">
          {hasSessions ? "Nothing in this period yet." : "Your communication story starts here."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#665f66]">
          {hasSessions
            ? "Try All time to see your sessions."
            : "Complete your first practice session and Aynam will begin learning how you communicate."}
        </p>
      </div>
    </main>
  );
}

