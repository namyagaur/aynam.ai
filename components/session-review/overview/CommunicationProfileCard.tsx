import { Info, Lightbulb, Activity, Sparkles, Shield, Grid3x3, BookOpen } from "lucide-react";
import { mockSessionReview } from "@/lib/data/mockSessionReview";

const pillars = [
  { key: "clarity", label: "Clarity", angle: 120, icon: Lightbulb, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
  { key: "fluency", label: "Fluency", angle: 60, icon: Activity, iconBg: "bg-teal-50", iconColor: "text-teal-500" },
  { key: "confidence", label: "Confidence", angle: 0, icon: Shield, iconBg: "bg-green-50", iconColor: "text-green-500" },
  { key: "vocabulary", label: "Vocabulary", angle: 300, icon: BookOpen, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  { key: "structure", label: "Structure", angle: 240, icon: Grid3x3, iconBg: "bg-violet-50", iconColor: "text-violet-500" },
  { key: "presence", label: "Presence", angle: 180, icon: Sparkles, iconBg: "bg-pink-50", iconColor: "text-pink-500" },
] as const;

const CENTER = 150;
const MAX_RADIUS = 120;

function toPoint(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER - radius * Math.sin(rad),
  };
}

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const dataPoints = pillars.map((p) => {
    const value = scores[p.key] ?? 0;
    const r = (value / 100) * MAX_RADIUS;
    return toPoint(p.angle, r);
  });

  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map((level) =>
    pillars.map((p) => toPoint(p.angle, MAX_RADIUS * level)).map((p) => `${p.x},${p.y}`).join(" ")
  );

  const axisLines = pillars.map((p) => toPoint(p.angle, MAX_RADIUS));

  return (
    <svg viewBox="0 0 300 300" className="h-[360px] w-[360px]">
      {gridPolygons.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}
      {axisLines.map((pt, i) => (
        <line
          key={i}
          x1={CENTER}
          y1={CENTER}
          x2={pt.x}
          y2={pt.y}
          stroke="#E5E7EB"
          strokeWidth={1}
        />
      ))}
      <polygon
        points={dataPath}
        fill="#6366F1"
        fillOpacity={0.18}
        stroke="#6366F1"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={4} fill="#6366F1" />
      ))}
    </svg>
  );
}

export function CommunicationProfileCard() {
  const { communicationProfile } = mockSessionReview;
  const left = pillars.filter((p) => p.angle === 120 || p.angle === 180 || p.angle === 240);
  const right = pillars.filter((p) => p.angle === 60 || p.angle === 0 || p.angle === 300);

  return (
    <div className="rounded-2xl border border-[#F1F3F5] bg-white p-10 shadow-[0_8px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900">
          Your Communication Profile
        </h2>
        <Info className="h-4 w-4 text-gray-300" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-10">
        <div className="flex w-40 flex-col justify-between gap-14 py-6">
          {left.map((p) => (
            <PillarLabel key={p.key} pillar={p} score={communicationProfile[p.key]} align="left" />
          ))}
        </div>

        <RadarChart scores={communicationProfile} />

        <div className="flex w-40 flex-col justify-between gap-14 py-6">
          {right.map((p) => (
            <PillarLabel key={p.key} pillar={p} score={communicationProfile[p.key]} align="right" />
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-[15px] text-gray-400">
        Each pillar shows how effectively you communicated.
      </p>
    </div>
  );
}

function PillarLabel({
  pillar,
  score,
  align,
}: {
  pillar: (typeof pillars)[number];
  score: number;
  align: "left" | "right";
}) {
  const Icon = pillar.icon;
  return (
    <div className={`flex items-center gap-4 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${pillar.iconBg}`}>
        <Icon className={`h-4 w-4 ${pillar.iconColor}`} />
      </span>
      <div>
        <p className="text-[15px] font-medium text-gray-900">{pillar.label}</p>
        <p className="text-[15px] text-gray-900">
          <span className="font-semibold">{score}</span>
          <span className="text-gray-400"> /100</span>
        </p>
      </div>
    </div>
  );
}