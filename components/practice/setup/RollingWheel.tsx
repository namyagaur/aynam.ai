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
    <div className="mx-auto w-full max-w-5xl px-8">

      
      {/* Wheel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 48, opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-1 py-4"
        >
          <TopicRow topic={getTopic(-2)} opacity={20} />

<TopicRow topic={getTopic(-1)} opacity={60} />

<TopicRow topic={getTopic(0)} selected opacity={100} />

<TopicRow topic={getTopic(1)} opacity={60} />

<TopicRow topic={getTopic(2)} opacity={20} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}