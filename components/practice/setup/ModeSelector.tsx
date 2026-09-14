import { modes } from "../data/modes";
import ModeChip from "./ModeChip";

type Props = { selected: string; onChange: (mode: string) => void };

export default function ModeSelector({ selected, onChange }: Props) {
  return (
    <section>
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <ModeChip
            key={mode.id}
            {...mode}
            selected={selected === mode.id}
            onClick={() => onChange(mode.id)}
          />
        ))}
      </div>
    </section>
  );
}
