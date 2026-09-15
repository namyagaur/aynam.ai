import { Star, AlertTriangle, MessageCircle, CheckCircle2 } from "lucide-react";
import { mockSessionReview } from "@/lib/data/mockSessionReview";

export function SessionHighlights({ highlights = mockSessionReview.highlights }: { highlights?: typeof mockSessionReview.highlights }) {

  return (
    <div className="mt-3">
      <h2 className="text-sm font-semibold text-gray-900">Session Highlights</h2>

      <div className="mt-3 grid grid-cols-3 gap-4">
        <HighlightCard
          icon={Star}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          title="What you did well"
          items={highlights.strengths}
          bulletColor="text-green-500"
          BulletIcon={CheckCircle2}
        />
        <HighlightCard
          icon={AlertTriangle}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          title="Where you lost me"
          items={highlights.improvements}
          bulletColor="text-orange-500"
          BulletIcon={AlertTriangle}
        />
        <HighlightCard
          icon={MessageCircle}
          iconBg="bg-[var(--theme-accent-soft)]"
          iconColor="text-[var(--theme-accent)]"
          title="What I understood"
          items={highlights.understood}
        />
      </div>
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  items,
  bulletColor,
  BulletIcon,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  items: string[];
  bulletColor?: string;
  BulletIcon?: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface-elevated)] p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-3 w-3 ${iconColor}`} />
        </span>
        <p className="text-sm font-semibold text-[var(--theme-text)]">{title}</p>
      </div>

      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[13px] leading-snug text-[var(--theme-text-muted)]">
            {BulletIcon && bulletColor ? (
              <BulletIcon className={`mt-0.5 h-3 w-3 flex-shrink-0 ${bulletColor}`} />
            ) : null}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
