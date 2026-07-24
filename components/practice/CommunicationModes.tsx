"use client";

import { useState } from "react";

import { modes } from "./modes";
import ModeCard from "./ModeCard";

export default function CommunicationModes() {
  const [selectedMode, setSelectedMode] = useState("hr");

  return (
    <div className="flex flex-col gap-3">
      {modes.map((mode) => (
        <div key={mode.id} onClick={() => setSelectedMode(mode.id)}>
          <ModeCard
            title={mode.title}
            description={mode.description}
            icon={mode.icon}
            color={mode.color}
            selected={selectedMode === mode.id}
          />
        </div>
      ))}
    </div>
  );
}