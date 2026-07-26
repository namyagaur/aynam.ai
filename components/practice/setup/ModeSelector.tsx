"use client";

import { useState } from "react";
import { modes } from "../data/modes";
import ModeChip from "./ModeChip";

export default function ModeSelector() {
  const [selected, setSelected] = useState("hr");

  return (
    <section className="mt-10">
<div className="mt-5 flex flex-wrap gap-2">
        {modes.map((mode) => (
          <ModeChip
            key={mode.id}
            {...mode}
            selected={selected === mode.id}
            onClick={() => setSelected(mode.id)}
          />
        ))}

      </div>

    </section>
  );
}