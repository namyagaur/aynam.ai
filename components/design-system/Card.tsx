import { ReactNode } from "react";
import clsx from "clsx";
import Surface from "./Surface";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <Surface
      className={clsx(
        `
        p-6
        md:p-8
        `,
        className
      )}
    >
      {children}
    </Surface>
  );
}