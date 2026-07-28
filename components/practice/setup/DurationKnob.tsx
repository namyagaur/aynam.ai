import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * DurationKnob
 * A circular duration picker rendered entirely in SVG.
 * - 270° arc track (90° gap centered at the bottom)
 * - 6 fixed stops: 1, 3, 5, 10, 15, 20 (minutes), evenly spaced around the arc
 * - Draggable thumb that snaps to the nearest stop
 * - Faint dotted guide ring tracing the full sweep
 * - "Glass" white center showing the current value
 *
 * No external libraries — pointer events + basic trig only.
 */

export interface DurationKnobProps {
  value: number;
  onChange: (v: number) => void;
}

const STOPS = [1, 3, 5, 10, 15, 20] as const;

const START_ANGLE = -135; // degrees, 0 = 12 o'clock, clockwise positive
const END_ANGLE = 135;
const ARC_SWEEP = END_ANGLE - START_ANGLE; // 270

const SIZE = 300;
const CENTER = SIZE / 2;
const TRACK_RADIUS = 108;
const DOT_RADIUS = 130;
const LABEL_RADIUS = 150;
const THUMB_RADIUS = 15;

const STOP_ANGLE_STEP = ARC_SWEEP / (STOPS.length - 1);

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** angle: 0 = top, clockwise positive */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = toRad(angleDeg);
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function angleForValue(value: number): number {
  const idx = STOPS.indexOf(value as (typeof STOPS)[number]);
  const safeIdx = idx === -1 ? 2 : idx; // fall back to the "5" stop
  return START_ANGLE + safeIdx * STOP_ANGLE_STEP;
}

function nearestStopFromAngle(angle: number): number {
  const clamped = Math.min(END_ANGLE, Math.max(START_ANGLE, angle));
  const idx = Math.round((clamped - START_ANGLE) / STOP_ANGLE_STEP);
  const safeIdx = Math.min(STOPS.length - 1, Math.max(0, idx));
  return STOPS[safeIdx];
}

export default function DurationKnob({ value, onChange }: DurationKnobProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const currentAngle = angleForValue(value);

  const angleFromPointer = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return currentAngle;
    const rect = svg.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;
    const dx = x - CENTER;
    const dy = y - CENTER;
    // 0 = top, clockwise positive
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;

    // The forbidden 90° gap sits at the bottom, split across ±180.
    // Anything past our usable range clamps to the nearer end rather
    // than wrapping around through the gap.
    if (angle > END_ANGLE && angle <= 180) angle = END_ANGLE;
    if (angle < START_ANGLE && angle >= -180) angle = START_ANGLE;
    return angle;
  }, [currentAngle]);

  const commitFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const angle = angleFromPointer(clientX, clientY);
      const stop = nearestStopFromAngle(angle);
      if (stop !== value) onChange(stop);
    },
    [angleFromPointer, onChange, value]
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: PointerEvent) => {
      e.preventDefault();
      commitFromPointer(e.clientX, e.clientY);
    };
    const handleUp = () => setDragging(false);

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [dragging, commitFromPointer]);

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const idx = STOPS.indexOf(value as (typeof STOPS)[number]);
    const currentIdx = idx === -1 ? 2 : idx;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(STOPS[Math.min(STOPS.length - 1, currentIdx + 1)]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(STOPS[Math.max(0, currentIdx - 1)]);
    }
  };

  // Faint dotted guide ring across the full 270° sweep.
  const guideDots = [];
  const DOT_COUNT = 60;
  for (let i = 0; i <= DOT_COUNT; i++) {
    const angle = START_ANGLE + (ARC_SWEEP / DOT_COUNT) * i;
    const { x, y } = polarToCartesian(CENTER, CENTER, DOT_RADIUS, angle);
    guideDots.push(
      <circle key={i} cx={x} cy={y} r={1.6} className="fill-gray-300" />
    );
  }

  const thumbPos = polarToCartesian(CENTER, CENTER, TRACK_RADIUS, currentAngle);

  return (
    <div className="relative select-none" style={{ width: SIZE, height: SIZE }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="knob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* dotted guide ring */}
        <g>{guideDots}</g>

        {/* background track */}
        <path
          d={describeArc(CENTER, CENTER, TRACK_RADIUS, START_ANGLE, END_ANGLE)}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          className="stroke-gray-200"
        />

        {/* active track, from start up to the current value */}
        <path
          d={describeArc(CENTER, CENTER, TRACK_RADIUS, START_ANGLE, currentAngle)}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          stroke="url(#knob-gradient)"
        />

        {/* fixed stop labels */}
        {STOPS.map((stop, i) => {
          const angle = START_ANGLE + i * STOP_ANGLE_STEP;
          const { x, y } = polarToCartesian(CENTER, CENTER, LABEL_RADIUS, angle);
          const active = stop === value;
          return (
            <text
              key={stop}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={
                active
                  ? "text-[13px] font-semibold fill-indigo-500"
                  : "text-[13px] font-medium fill-gray-400"
              }
            >
              {stop} min
            </text>
          );
        })}

        {/* draggable thumb */}
        <g
          transform={`translate(${thumbPos.x} ${thumbPos.y})`}
          onPointerDown={handleThumbPointerDown}
          tabIndex={0}
          role="slider"
          aria-valuemin={STOPS[0]}
          aria-valuemax={STOPS[STOPS.length - 1]}
          aria-valuenow={value}
          aria-label="Practice duration in minutes"
          onKeyDown={handleKeyDown}
          className="cursor-grab outline-none active:cursor-grabbing"
          style={{ touchAction: "none" }}
        >
          <circle r={THUMB_RADIUS} className="fill-white stroke-indigo-500" strokeWidth={2.5} />
          <path
            d="M -5 0 L -1.5 4 L 5.5 -4.5"
            fill="none"
            stroke="#6366F1"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* glass center */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white/90 backdrop-blur-sm ring-1 ring-black/5"
          style={{ boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)" }}
        >
          <span className="text-4xl font-bold text-gray-900">{value}</span>
          <span className="text-sm font-medium text-gray-400">min</span>
        </div>
      </div>
    </div>
  );
}
