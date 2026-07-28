"use client";

import { motion, AnimatePresence } from "framer-motion";
import TopicRow from "./TopicRow";

type RollingWheelProps = {
  topics: string[];
  currentIndex: number;
};

export default function RollingWheel({
  topics,
  currentIndex,
}: RollingWheelProps) {
  const getTopic = (offset: number) => {
    const length = topics.length;
    const index = (currentIndex + offset + length) % length;
    return topics[index];
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">

      {/* Top Fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#F8F4EE] via-[#F8F4EE]/80 to-transparent" />

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#F8F4EE] via-[#F8F4EE]/80 to-transparent" />

      {/* Highlight Window */}
      <div className="pointer-events-none absolute left-4 right-4 top-1/2 z-10 h-14 -translate-y-1/2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50/80 via-white to-violet-50/80 shadow-lg" />

      {/* Wheel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: -35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 35, opacity: 0 }}
          transition={{
            duration: 0.35,
            ease: "easeInOut",
          }}
          className="flex flex-col py-5"
        >
          <TopicRow topic={getTopic(-2)} opacity={15} />

          <TopicRow topic={getTopic(-1)} opacity={45} />

          <TopicRow topic={getTopic(0)} selected opacity={100} />

          <TopicRow topic={getTopic(1)} opacity={45} />

          <TopicRow topic={getTopic(2)} opacity={15} />
        </motion.div>
      </AnimatePresence><div className="pointer-events-none absolute left-4 right-4 top-1/2 z-10 h-14 -translate-y-1/2 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50/80 via-white to-violet-50/80 shadow-[0_8px_30px_rgba(108,99,255,0.10)]" />
    </div>
  );
}