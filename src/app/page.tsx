"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const screens = [
  {
    title: "Hi.",
  },
  {
    title: "You aren't alone.",
  },
  {
    number: "13,927",
    subtitle: "people are improving themselves today",
    caption: "Your journey begins here.",
  },
  {
    title: "Let's begin.",
    subtitle: "today.",
  },
];

export default function Home() {
  const [screen, setScreen] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (screen >= screens.length - 1) return;

    const timer = setTimeout(() => {
      setScreen((prev) => prev + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [screen]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFDF8] flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{
            opacity: 0,
            filter: "blur(12px)",
            y: 20,
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
          }}
          exit={{
            opacity: 0,
            filter: "blur(12px)",
            y: -20,
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="relative z-10 text-center"
        >
          {screen === 0 && (
            <h1 className="text-5xl md:text-6xl font-extralight tracking-tight">
              Hi.
            </h1>
          )}

          {screen === 1 && (
            <h1 className="text-5xl md:text-6xl font-extralight tracking-tight">
              You aren't alone.
            </h1>
          )}

          {screen === 2 && (
            <div>
              <h1 className="text-8xl md:text-[10rem] font-thin text-[#A78BFA] tracking-tight">
                13,927
              </h1>

              <p className="mt-4 text-lg text-gray-700">
                people are improving themselves today
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Your journey begins here.
              </p>
            </div>
          )}

          {screen === 3 && (
            <div>
              <h1 className="text-6xl md:text-7xl font-extralight tracking-tight">
                Let's begin.
              </h1>

              <p className="mt-2 text-4xl md:text-5xl text-[#A78BFA] font-extralight">
                today.
              </p>

              <motion.div
                onClick={() => router.push("/prepare")}
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="mt-16 text-3xl text-gray-400 cursor-pointer"
              >
                ↓
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}