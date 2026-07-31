import { Star, AlertTriangle, MessageCircle, CheckCircle2 } from "lucide-react";
import { mockSessionReview } from "@/lib/data/mockSessionReview";

export function SessionHighlights() {
  const { highlights } = mockSessionReview;

  return (
    <div className="mt-6">
      <h2 className="text-base font-semibold text-gray-900">Session Highlights</h2>

      <div className="mt-3 grid grid-cols-3 gap-6">
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
          iconBg="bg-violet-50"
          iconColor="text-violet-500"
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
    <div className="min-h-[230px] rounded-[24px] border border-gray-100 p-6">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        </span>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
      </div>

      <ul className="mt-3 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-snug text-gray-500">
            {BulletIcon && bulletColor ? (
              <BulletIcon className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${bulletColor}`} />
            ) : null}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}