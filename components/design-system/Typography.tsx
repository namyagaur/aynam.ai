import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export function H1({ children, className = "" }: Props) {
  return (
    <h1
      className={clsx(
        "text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-primary)]",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: Props) {
  return (
    <h2
      className={clsx(
        "text-2xl font-semibold text-[var(--text-primary)]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Body({ children, className = "" }: Props) {
  return (
    <p
      className={clsx(
        "text-base leading-7 text-[var(--text-secondary)]",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Caption({ children, className = "" }: Props) {
  return (
    <span
      className={clsx(
        "text-sm text-[var(--text-muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}