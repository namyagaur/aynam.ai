"use client";

import { motion } from "motion/react";

const stars = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.45 + 0.2,
  duration: 30 + Math.random() * 40,
}));

export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B1020]">

      {/* Moonlight */}
      <motion.div
        className="absolute -left-60 -top-60 h-[1200px] w-[1200px] rounded-full"
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(165,205,255,.22) 0%, rgba(165,205,255,.08) 35%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />

      {/* Blue Nebula */}
      <motion.div
        className="absolute left-[35%] top-[15%] h-[900px] w-[900px] rounded-full"
        animate={{
          x: [0, 15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(84,144,255,.14), transparent 72%)",
          filter: "blur(120px)",
        }}
      />

      {/* Lavender Glow */}
      <motion.div
        className="absolute right-[-250px] bottom-[-250px] h-[1100px] w-[1100px] rounded-full"
        animate={{
          x: [0, -20, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 65,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(165,135,255,.10), transparent 75%)",
          filter: "blur(170px)",
        }}
      />

      {/* Stars */}

      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [star.opacity, star.opacity + 0.15, star.opacity],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Floating Dust */}

      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-sky-200"
          style={{
            left: `${15 + i * 18}%`,
            bottom: "-10%",
            opacity: 0.25,
          }}
          animate={{
            y: [-1000],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: 45 + i * 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 6,
          }}
        />
      ))}

      {/* Vignette */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,.55) 100%)",
        }}
      />

      {/* Top Fade */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,.03), transparent 30%)",
        }}
      />

    </div>
  );
}