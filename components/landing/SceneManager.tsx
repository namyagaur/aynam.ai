"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import AnimatedNumber from "./AnimatedNumber";
import Typewriter from "./Typewriter";

export default function SceneManager() {
  const [scene, setScene] = useState(0);
  const [showSentence, setShowSentence] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  return (
    <div className="relative flex items-center justify-center">

      <AnimatePresence mode="wait">

        {/* ---------------- Scene 1 ---------------- */}

        {scene === 0 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -6,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Typewriter
              text="hi. you aren't alone."
              className="text-[34px] text-[#F4F6FB]"
              onComplete={() => {
                setTimeout(() => setScene(1), 1400);
              }}
            />
          </motion.div>
        )}

        {/* ---------------- Scene 2 ---------------- */}

        {scene === 1 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -6,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Typewriter
              text="every great speaker once struggled to find their voice."
              className="max-w-[760px] text-center text-[34px] font-medium text-[#F4F6FB]"
              onComplete={() => {
                setTimeout(() => setScene(2), 1800);
              }}
            />
          </motion.div>
        )}

        {/* ---------------- Scene 3 ---------------- */}

        {scene === 2 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -6,
              filter: "blur(6px)",
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex items-center flex-wrap justify-center gap-2"
          >
            <AnimatedNumber
              value={18247}
              onComplete={() => {
                setShowSentence(true);
              }}
            />

            {showSentence && (
              <Typewriter
                text=" people are practicing their communication today."
                className="text-[34px] text-[#F4F6FB]"
                onComplete={() => {
                  setTimeout(() => setScene(3), 1800);
                }}
              />
            )}
          </motion.div>
        )}

        {/* ---------------- Scene 4 ---------------- */}

        {scene === 3 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-10"
          >
            <Typewriter
              text="your turn."
              className="text-[34px] text-[#F4F6FB]"
              onComplete={() => {
                setTimeout(() => setShowArrow(true), 400);
              }}
            />

            {showArrow && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: [0, 5, 0],
                }}
                transition={{
                  opacity: {
                    duration: 0.8,
                  },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <ChevronDown
                  size={28}
                  strokeWidth={1.5}
                  color="#F4F6FB"
                />
              </motion.div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}