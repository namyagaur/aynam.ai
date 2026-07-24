import { ReactNode } from "react";
import clsx from "clsx";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
};

export default function Surface({
  children,
  className = "",
}: SurfaceProps) {
  return (
    <div
      className={clsx(
        `
        bg-[var(--surface)]
        border
        border-[var(--border)]
        rounded-[20px]
        shadow-[var(--shadow)]
        transition-all
        duration-300
        `,
        className
      )}
    >
      {children}
    </div>
  );
}