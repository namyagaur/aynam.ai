"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export default function AnimatedNumber({
  value,
  duration = 2.2,
  className = "",
  onComplete,
}: AnimatedNumberProps) {
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    count.set(0);

    const controls = animate(count, value, {
      duration,
      ease: [0.22, 1, 0.36, 1], // Apple's easing
      onComplete,
    });

    return () => controls.stop();
  }, [value, duration, count, onComplete]);

  return (
    <motion.span
      initial={{
        opacity: 0,
        y: 10,
        filter: "blur(8px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        inline-block
        bg-gradient-to-r
        from-sky-300
        via-blue-200
        to-violet-300
        bg-clip-text
        text-[48px]
        font-semibold
        tracking-[-0.05em]
        text-transparent
        ${className}
      `}
      style={{
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {rounded}
    </motion.span>
  );
}