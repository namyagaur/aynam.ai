"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Lightbulb,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { mockInsights, type InsightPeriod, type InsightSkill } from "@/lib/data/mockInsights";

const periods: InsightPeriod[] = ["7 days", "30 days", "90 days"];

const toneStyles: Record<InsightSkill["tone"], { icon: string; bar: string }> = {
  amber: { icon: "bg-amber-50 text-amber-500", bar: "bg-amber-400" },
  blue: { icon: "bg-sky-50 text-sky-500", bar: "bg-sky-400" },
  green: { icon: "bg-emerald-50 text-emerald-500", bar: "bg-emerald-500" },
  orange: { icon: "bg-orange-50 text-orange-500", bar: "bg-orange-400" },
  violet: { icon: "bg-violet-50 text-violet-600", bar: "bg-violet-500" },
  pink: { icon: "bg-pink-50 text-pink-500", bar: "bg-pink-400" },
};

const skillIcons = [Lightbulb, TrendingUp, Target, BarChart3, Sparkles, Star];

export default function InsightsPage() {
  const [period, setPeriod] = useState<InsightPeriod>(mockInsights.period);

  return (
    <main className="min-h-full bg-[#FFFDF7] px-8 py-7 xl:px-10">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[32px] font-semibold leading-none tracking-[-0.04em] text-[#171927]">Insights</h1>
            <p className="mt-2 text-[14px] text-[#687087]">See how your communication is changing over time.</p>
          </div>
          <div className="flex rounded-xl border border-[#ebeaf1] bg-white p-1 shadow-[0_3px_12px_rgba(91,92,154,.04)]" aria-label="Insight time range">
            {periods.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPeriod(option)}
                aria-pressed={period === option}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${period === option ? "bg-[#eee9ff] text-[#6956e9] shadow-sm" : "text-[#667087] hover:bg-[#faf9fd]"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </header>

        <section className="mt-4 overflow-hidden rounded-2xl border border-[#eceaf1] bg-white shadow-[0_5px_22px_rgba(91,92,154,.05)]" aria-labelledby="progress-title">
          <div className="grid grid-cols-[1fr_1.58fr_1fr] divide-x divide-[#f0eff4]">
            <div className="p-5 pr-4">
              <SectionHeading icon={<BarChart3 className="h-4 w-4" />} title="Communication Progress" id="progress-title" />
              <div className="mt-5 flex items-end gap-2">
                <span className="text-[43px] font-semibold leading-none tracking-[-0.06em] text-[#111827]">{mockInsights.overall.score}</span>
                <span className="mb-1 text-[18px] text-[#9aa0ad]">/100</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" /> +{mockInsights.overall.change}%
              </div>
              <p className="mt-3 max-w-[165px] text-xs leading-5 text-[#687087]">{mockInsights.overall.summary}</p>
            </div>

            <ProgressChart />

            <SkillBreakdown />
          </div>
        </section>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <SkillInsightCard
            title="Your Strongest Skill"
            icon={<Star className="h-4 w-4" />}
            iconStyle="bg-emerald-50 text-emerald-600"
            accent="from-emerald-50/80"
            name={mockInsights.strongestSkill.name}
            score={mockInsights.strongestSkill.score}
            change={`↑ ${mockInsights.strongestSkill.change} points`}
            description={mockInsights.strongestSkill.description}
          />
          <SkillInsightCard
            title="Your Biggest Opportunity"
            icon={<Target className="h-4 w-4" />}
            iconStyle="bg-pink-50 text-pink-500"
            accent="from-pink-50/70"
            name={mockInsights.opportunity.name}
            score={mockInsights.opportunity.score}
            description={mockInsights.opportunity.description}
          />
          <PatternsCard />
        </div>

        <div className="mt-3 grid grid-cols-[1.65fr_0.85fr] gap-3 pb-5">
          <RecentSessions />
          <section className="flex flex-col justify-between rounded-2xl border border-[#eceaf1] bg-gradient-to-br from-[#f6f0ff] via-[#fbf7ff] to-[#fff8f2] p-5 shadow-[0_5px_22px_rgba(91,92,154,.04)]">
            <div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#745af0] shadow-sm"><Sparkles className="h-4 w-4" /></div>
              <h2 className="mt-4 text-sm font-semibold text-[#1b2030]">Keep going, Namya!</h2>
              <p className="mt-3 text-xs leading-5 text-[#687087]">You&apos;ve completed 12 sessions this month. Your communication is getting stronger with each one.</p>
            </div>
            <button type="button" className="mt-5 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6749ed] text-xs font-semibold text-white shadow-[0_8px_18px_rgba(103,73,237,.2)] transition hover:bg-[#573bd9]">Start a new practice <ArrowRight className="h-3.5 w-3.5" /></button>
          </section>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({ icon, title, id }: { icon: React.ReactNode; title: string; id?: string }) {
  return <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1c2231]" id={id}><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0edff] text-[#6e58ed]">{icon}</span>{title}{title === "Communication Progress" && <CircleHelp className="h-3.5 w-3.5 text-[#a6a9b5]" />}</div>;
}

function ProgressChart() {
  const points = mockInsights.progress;
  const width = 390;
  const height = 144;
  const padding = { top: 18, right: 10, bottom: 28, left: 28 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const getX = (index: number) => padding.left + (index / (points.length - 1)) * chartWidth;
  const getY = (score: number) => padding.top + ((100 - score) / 100) * chartHeight;
  const line = points.map((point, index) => `${getX(index)},${getY(point.score)}`).join(" ");
  const area = `${padding.left},${height - padding.bottom} ${line} ${getX(points.length - 1)},${height - padding.bottom}`;

  return (
    <div className="px-3 py-4" aria-label={`Communication score rose from ${points[0].score} to ${points[points.length - 1].score} over ${mockInsights.period}`}>
      <div className="mb-1 flex justify-end"><span className="rounded-lg bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-600">+{mockInsights.overall.change}%<span className="ml-1 block text-[10px] font-normal text-emerald-500">in the last 30 days</span></span></div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[142px] w-full overflow-visible" role="img" aria-labelledby="chart-title chart-description">
        <title id="chart-title">Communication progress</title>
        <desc id="chart-description">Score increased from 68 to 84 across five recent sessions.</desc>
        {[25, 50, 75, 100].map((value) => <g key={value}><line x1={padding.left} x2={width - padding.right} y1={getY(value)} y2={getY(value)} stroke="#f0eff5" strokeWidth="1" /><text x="2" y={getY(value) + 3} fill="#9aa0ad" fontSize="9">{value}</text></g>)}
        {points.map((point, index) => <line key={point.label} x1={getX(index)} x2={getX(index)} y1={padding.top} y2={height - padding.bottom} stroke="#f3f2f7" strokeWidth="1" />)}
        <polygon points={area} fill="url(#insight-fill)" />
        <polyline points={line} fill="none" stroke="#735cf4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        {points.map((point, index) => <circle key={point.label} cx={getX(index)} cy={getY(point.score)} r="3.5" fill="white" stroke="#735cf4" strokeWidth="2" />)}
        {points.map((point, index) => <text key={`${point.label}-label`} x={getX(index)} y={height - 7} textAnchor="middle" fill="#9298a8" fontSize="9">{point.label}</text>)}
        <defs><linearGradient id="insight-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#826df5" stopOpacity=".16" /><stop offset="100%" stopColor="#826df5" stopOpacity=".01" /></linearGradient></defs>
      </svg>
    </div>
  );
}

function SkillBreakdown() {
  return (
    <div className="p-5 pl-4">
      <SectionHeading icon={<Sparkles className="h-4 w-4" />} title="Skill Breakdown" />
      <div className="mt-3 space-y-2.5">
        {mockInsights.skills.map((skill, index) => {
          const Icon = skillIcons[index];
          const style = toneStyles[skill.tone];
          return <div key={skill.name} className="grid grid-cols-[22px_72px_1fr_24px] items-center gap-2 text-xs"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${style.icon}`}><Icon className="h-3 w-3" /></span><span className="text-[#3f4658]">{skill.name}</span><span className="h-1.5 overflow-hidden rounded-full bg-[#eff0f4]"><span className={`block h-full rounded-full ${style.bar}`} style={{ width: `${skill.score}%` }} /></span><span className="text-right font-semibold text-[#303647]">{skill.score}</span></div>;
        })}
      </div>
    </div>
  );
}

function SkillInsightCard({ title, icon, iconStyle, accent, name, score, change, description }: { title: string; icon: React.ReactNode; iconStyle: string; accent: string; name: string; score: number; change?: string; description: string }) {
  return <section className={`relative overflow-hidden rounded-2xl border border-[#eceaf1] bg-gradient-to-br ${accent} via-white to-white p-5 shadow-[0_5px_22px_rgba(91,92,154,.04)]`}><div className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconStyle}`}>{icon}</div><h2 className="mt-3 text-xs font-semibold text-[#252b3b]">{title}</h2><div className="mt-2 flex items-baseline gap-2"><span className="text-[17px] font-semibold text-[#111827]">{name}</span></div><div className="mt-0.5 flex items-baseline gap-1"><span className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[#111827]">{score}</span><span className="text-xs text-[#9aa0ad]">/100</span></div>{change && <div className="mt-1 text-xs font-medium text-emerald-600">{change}</div>}<p className="mt-3 max-w-[210px] text-xs leading-5 text-[#687087]">{description}</p></section>;
}

function PatternsCard() {
  return <section className="rounded-2xl border border-[#eceaf1] bg-white p-5 shadow-[0_5px_22px_rgba(91,92,154,.04)]"><SectionHeading icon={<Sparkles className="h-4 w-4" />} title="Patterns I've Noticed" /><ul className="mt-3 space-y-2.5">{mockInsights.patterns.map((pattern) => <li key={pattern} className="flex gap-2 text-xs leading-4 text-[#4c556a]"><span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#7160ed] text-white"><Check className="h-2.5 w-2.5" /></span>{pattern}</li>)}</ul></section>;
}

function RecentSessions() {
  return <section className="rounded-2xl border border-[#eceaf1] bg-white shadow-[0_5px_22px_rgba(91,92,154,.04)]"><div className="flex items-center justify-between border-b border-[#f0eff4] px-5 py-4"><SectionHeading icon={<Clock3 className="h-4 w-4" />} title="Recent Sessions" /><button type="button" className="flex items-center gap-1 text-xs font-medium text-[#7259ee] hover:text-[#5139d5]">View all <ArrowRight className="h-3.5 w-3.5" /></button></div><div className="px-5">{mockInsights.recentSessions.map((session) => <button key={session.id} type="button" className="grid w-full grid-cols-[84px_1fr_64px_38px_12px] items-center gap-3 border-b border-[#f1f0f4] py-3 text-left text-xs last:border-0 hover:bg-[#fcfbff]"><span className="text-[#687087]">{session.date}</span><span className="font-medium text-[#3d4558]">{session.type}</span><span className="text-[#8991a1]">{session.duration}</span><span className={`rounded-full px-2 py-1 text-center font-semibold ${session.score >= 80 ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>{session.score}</span><ChevronRight className="h-3.5 w-3.5 text-[#9ba1ae]" /></button>)}</div></section>;
}
