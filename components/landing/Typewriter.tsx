"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export default function Typewriter({
  text,
  speed = 45,
  delay = 0,
  className = "",
  cursor = true,
  onComplete,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(cursor);

  const completed = useRef(false);

  useEffect(() => {
    completed.current = false;

    setDisplayed("");
    setShowCursor(cursor);

    const start = setTimeout(() => {
      let i = 0;

      const interval = setInterval(() => {
        i++;

        setDisplayed(text.slice(0, i));

        if (i >= text.length) {
          clearInterval(interval);

          setTimeout(() => {
            setShowCursor(false);

            if (!completed.current) {
              completed.current = true;
              onComplete?.();
            }
          }, 250);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(start);
  }, [text, speed, delay, cursor, onComplete]);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span>{displayed}</span>

      {showCursor && (
        <motion.span
          animate={{
            opacity: [1, 0.15, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="ml-[2px] inline-block h-[1.05em] w-[1.5px] rounded-full bg-current"
        />
      )}
    </div>
  );
}