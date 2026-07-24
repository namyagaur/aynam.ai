"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

type NavigationItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
};

export default function NavigationItem({
  href,
  label,
  icon: Icon,
  collapsed,
}: NavigationItemProps) {
  const pathname = usePathname();

  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "group flex h-11 items-center rounded-xl transition-all duration-300",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active
          ? "bg-black/5 text-black"
          : "text-black/60 hover:bg-black/5 hover:text-black"
      )}
    >
      <Icon
        size={18}
        strokeWidth={1.7}
        className="shrink-0"
      />

      <span
        className={clsx(
          "whitespace-nowrap transition-all duration-300",
          collapsed
            ? "w-0 overflow-hidden opacity-0"
            : "opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  );
}