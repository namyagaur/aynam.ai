"use client";

import { useState } from "react";
import ModeCard from "./ModeCard";
import { modes } from "./modes";

export default function CommunicationModes() {
  const [selectedMode, setSelectedMode] = useState("hr");

  return (
    <div className="flex h-full flex-col gap-2">

      {modes.map((mode) => (
        <ModeCard
          key={mode.id}
          title={mode.title}
          icon={mode.icon}
          color={mode.color}
          selected={selectedMode === mode.id}
          onClick={() => setSelectedMode(mode.id)}
        />
      ))}

    </div>
  );
}