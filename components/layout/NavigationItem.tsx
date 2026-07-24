"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

type NavigationItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export default function NavigationItem({
  href,
  label,
  icon: Icon,
}: NavigationItemProps) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
        active
          ? "bg-white shadow-sm text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:bg-white/60 hover:text-[var(--text-primary)]"
      )}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span className="text-[15px] font-medium">{label}</span>
    </Link>
  );
}