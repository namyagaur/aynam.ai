// DurationKnob.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: number; // 1 - 20
  onChange: (value: number) => void;
};

const MIN = 1;
const MAX = 20;

// 270° sweep
const START_ANGLE = 225;
const END_ANGLE = 495;
const SWEEP = END_ANGLE - START_ANGLE;

const SIZE = 255;
const CENTER = SIZE / 2;

// Slightly tightened radii so the arc, dots, and labels read as one
// coherent ring instead of three separately-spaced elements.
const GUIDE_RADIUS = 88;
const TRACK_RADIUS = 72;
const LABEL_RADIUS = GUIDE_RADIUS + 22;
const GLASS_RADIUS = 54;
const GLASS_RING_RADIUS = 60;
const THUMB_RADIUS = 9;
const THUMB_CORE_RADIUS = 3.5;

const GUIDE_DOT_COUNT = 56;

// Hand-tuned angles (not equal interpolation) so 1/5/10/15/20 sit
// optically centered under their tick rather than mathematically centered.
const LABELS = [
  { value: 1, angle: 227 },
  { value: 5, angle: 293 },
  { value: 10, angle: 359 },
  { value: 15, angle: 425 },
  { value: 20, angle: 493 },
];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
}

function valueToAngle(v: number) {
  return START_ANGLE + ((clamp(v, MIN, MAX) - MIN) / (MAX - MIN)) * SWEEP;
}

function angleToValue(deg: number) {
  const percent = (deg - START_ANGLE) / SWEEP;
  return Math.round(MIN + percent * (MAX - MIN));
}

export default function DurationKnob({ value, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const handleUpRef = useRef<(() => void) | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const angle = useMemo(() => valueToAngle(value), [value]);

  const thumb = useMemo(
    () => polarToCartesian(CENTER, CENTER, TRACK_RADIUS, angle),
    [angle]
  );

  const activeArc = useMemo(
    () => describeArc(CENTER, CENTER, TRACK_RADIUS, START_ANGLE, angle),
    [angle]
  );

  const trackArc = useMemo(
    () => describeArc(CENTER, CENTER, TRACK_RADIUS, START_ANGLE, END_ANGLE),
    []
  );

  const guideDots = useMemo(
    () =>
      Array.from({ length: GUIDE_DOT_COUNT }, (_, i) => {
        const a = START_ANGLE + (i / (GUIDE_DOT_COUNT - 1)) * SWEEP;
        return polarToCartesian(CENTER, CENTER, GUIDE_RADIUS, a);
      }),
    []
  );

  const labelPositions = useMemo(
    () =>
      LABELS.map((label) => ({
        ...label,
        pos: polarToCartesian(CENTER, CENTER, LABEL_RADIUS, label.angle),
      })),
    []
  );

  const pointerToValue = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return value;

    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left - CENTER;
    const y = clientY - rect.top - CENTER;

    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    if (deg < START_ANGLE) deg += 360;
    deg = clamp(deg, START_ANGLE, END_ANGLE);

    return angleToValue(deg);
  }, [value]);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      onChange(pointerToValue(clientX, clientY));
    },
    [onChange, pointerToValue]
  );

  const handleMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return;
      update(e.clientX, e.clientY);
    },
    [update]
  );

  const handleUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
    window.removeEventListener("pointermove", handleMove);
    if (handleUpRef.current) {
      window.removeEventListener("pointerup", handleUpRef.current);
    }
  }, [handleMove]);

  useEffect(() => {
    handleUpRef.current = handleUp;

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (handleUpRef.current) {
        window.removeEventListener("pointerup", handleUpRef.current);
      }
    };
  }, [handleMove, handleUp]);

  const handleDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      dragging.current = true;
      setIsDragging(true);
      update(e.clientX, e.clientY);
      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [handleMove, handleUp, update]
  );

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        className="select-none touch-none cursor-pointer overflow-visible"
        onPointerDown={handleDown}
      >
        <defs>
          <filter id="knob-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="16" floodOpacity="0.06" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.05" />
          </filter>

          <filter id="thumb-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6759E8" floodOpacity="0.35" />
          </filter>

          {/* Soft radial gradient — reads as milk glass, not gloss */}
          <radialGradient id="glass" cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FCFCFE" />
            <stop offset="100%" stopColor="#F3F2F8" />
          </radialGradient>

          {/* Inner highlight, simulates a bevel catching light from top */}
          <linearGradient id="glass-highlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="progress" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8A9FF" />
            <stop offset="100%" stopColor="#6759E8" />
          </linearGradient>
        </defs>

        {/* guide dots */}
        {guideDots.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.6} fill="#DCD9EC" opacity={0.7} />
        ))}

        {/* background track */}
        <path d={trackArc} fill="none" stroke="#EAE7F5" strokeWidth={6} strokeLinecap="round" />

        {/* active progress */}
        <path
          d={activeArc}
          fill="none"
          stroke="url(#progress)"
          strokeWidth={6}
          strokeLinecap="round"
                      />

        {/* glass center */}
        <g filter="url(#knob-shadow)">
          <circle cx={CENTER} cy={CENTER} r={GLASS_RING_RADIUS} fill="none" stroke="#F6F6FA" strokeWidth={2} />
          <circle cx={CENTER} cy={CENTER} r={GLASS_RADIUS} fill="url(#glass)" stroke="#ECEAF3" strokeWidth={1.5} />
          <circle cx={CENTER} cy={CENTER} r={GLASS_RADIUS - 2} fill="url(#glass-highlight)" />
        </g>

        {/* duration readout — 8pt-aligned vertical rhythm */}
        <text
          x={CENTER}
          y={CENTER + 2}
          textAnchor="middle"
          fill="#5E54E8"
          style={{
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            transition: "opacity 100ms ease-out",
          }}
        >
          {value}
        </text>
        <text
          x={CENTER}
          y={CENTER + 24}
          textAnchor="middle"
          className="fill-neutral-400"
          style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.02em" }}
        >
          min
        </text>

        {/* thumb — soft puck, no material-style checkmark */}
        <g
          transform={`translate(${thumb.x},${thumb.y}) scale(${isDragging ? 1.12 : 1})`}
          style={{ transition: "transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          filter="url(#thumb-glow)"
        >
          <circle r={THUMB_RADIUS} fill="#FFFFFF" />
          <circle r={THUMB_RADIUS} fill="none" stroke="#EDEBF7" strokeWidth={1} />
          <circle r={THUMB_CORE_RADIUS} fill="#6759E8" />
        </g>

        {/* labels */}
        {labelPositions.map((label) => (
          <text
            key={label.value}
            x={label.pos.x}
            y={label.pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-neutral-500"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            {label.value}
          </text>
        ))}
      </svg>
    </div>
  );
}