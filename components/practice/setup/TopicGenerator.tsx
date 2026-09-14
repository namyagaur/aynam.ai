"use client";

import { useState } from "react";
import RollingWheel from "./RollingWheel";
import {
  publicSpeakingTopics,
  conversationTopics,
  storytellingTopics,
  socialTopics,
} from "../data/topics";
import ModeSelector from "./ModeSelector";
import PracticeSetup from "./PracticeSetup";
import PracticeHeader from "./PracticeHeader";
import RecordingSession from "../session/RecordingSession";
type Mode = "public" | "conversation" | "storytelling" | "social" | "custom";

type Props = {
  selectedMode?: Mode;
};

export default function TopicGenerator({
  selectedMode = "public",
}: Props) {
  const getTopics = (activeMode: Mode) => {
    switch (activeMode) {
      case "conversation":
        return conversationTopics;

      case "storytelling":
        return storytellingTopics;

      case "social":
        return socialTopics;

      default:
        return publicSpeakingTopics;
    }
  };

  const [mode, setMode] = useState<Mode>(selectedMode);
  const [topics, setTopics] = useState<string[]>(() => getTopics(selectedMode));
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const [step, setStep] = useState<
  "topic" | "setup" | "recording"
>("topic");
  const [duration, setDuration] = useState(5);

  const refreshTopics = async (activeMode = mode) => {
    if (activeMode !== "custom") {
      setTopics([...getTopics(activeMode)].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setHasRolled(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/topics", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: activeMode }) });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.topics)) throw new Error("Unable to create topics.");
      setTopics(data.topics);
      setCurrentIndex(0);
      setHasRolled(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModeChange = (nextMode: string) => {
    const activeMode = nextMode as Mode;
    setMode(activeMode);
    void refreshTopics(activeMode);
  };

  const handleRoll = () => {
    if (rolling) return;

    setRolling(true);
    setHasRolled(true);
    if (mode === "custom") void refreshTopics();
    const totalSteps = 12 + Math.floor(Math.random() * 5);

    let step = 0;

    const roll = () => {
      step++;

      setCurrentIndex((prev) => (prev + 1) % topics.length);

      if (step < totalSteps) {
        const speed = Math.min(35 + step * 5, 110);

        setTimeout(roll, speed);
      } else {
        setRolling(false);
      }
    };

    roll();
  };

  return (
  <section
    className={
      step === "recording"
        ? "mt-2 flex h-full min-h-0 flex-col"
        : "flex h-full min-h-0 flex-col"
    }
  >

    {step === "recording" && (
      <RecordingSession
        topic={topics[currentIndex]}
        duration={duration}
        onEnd={() => setStep("setup")}
      />
    )}

    {step === "topic" && (
      <>
        {/* Header pinned to top */}
        <PracticeHeader />

        {/* Flex-1 area: pills near top, wheel+button centered below */}
        <div className="flex flex-1 flex-col items-center pt-6">
          {/* Mode pills — horizontally centered, sitting between header and roller */}
          <div className="mb-auto pb-2">
            <ModeSelector selected={mode} onChange={handleModeChange} />
          </div>

          {/* Rolling wheel + button — centered in remaining space */}
          <div className="flex flex-1 flex-col items-center justify-center">
          <RollingWheel
            topics={topics}
            currentIndex={currentIndex}
          />

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleRoll}
              disabled={rolling || isGenerating}
              className="
                rounded-full
                border
                border-[var(--theme-border)]
                bg-[var(--theme-surface-elevated)]
                px-6
                py-2.5
                text-sm
                font-medium
              "
            >
              {rolling
                ? "Rolling..."
                : isGenerating
                ? "Creating topic..."
                : hasRolled
                ? "🎲 Roll Again"
                : "🎲 Roll Topic"}
            </button>

            {hasRolled && !rolling && (
              <button
                onClick={() => setStep("setup")}
                className="
                  rounded-full
                  bg-[var(--theme-primary)]
                  px-6
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                "
              >
                Continue →
              </button>
            )}
          </div>
          </div>
        </div>
      </>
    )}

   {step === "setup" && (
  <PracticeSetup
  topic={topics[currentIndex]}
  duration={duration}
  setDuration={setDuration}
  onBack={() => setStep("topic")}
  onContinue={() => setStep("recording")}
/>

)}
</section>
);
}

