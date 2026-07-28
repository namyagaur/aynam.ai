"use client";

import React, { useMemo, useRef, useState } from "react";

type Props = {
  value: number; // 1 - 20
  onChange: (value: number) => void;
};

const MIN = 1;
const MAX = 20;

// 270° knob
const START_ANGLE = 225;
const END_ANGLE = 495;
const SWEEP = END_ANGLE - START_ANGLE;

const SIZE = 290;
const CENTER = SIZE / 2;

const OUTER_RADIUS = 98;
const TRACK_RADIUS = 84;
const THUMB_RADIUS = 10;

const LABELS = [1, 5, 10, 15, 20];

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
) {
  const rad = ((angle - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number
) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);

  const largeArc = end - start <= 180 ? 0 : 1;

  return `M ${s.x} ${s.y}
          A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
}

export default function DurationKnob({
  value,
  onChange,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const [, force] = useState(false);

  const angle =
    START_ANGLE +
    ((clamp(value, MIN, MAX) - MIN) / (MAX - MIN)) * SWEEP;

  const thumb = polarToCartesian(
    CENTER,
    CENTER,
    TRACK_RADIUS,
    angle
  );

  const activeArc = useMemo(
    () =>
      describeArc(
        CENTER,
        CENTER,
        TRACK_RADIUS,
        START_ANGLE,
        angle
      ),
    [angle]
  );

  const trackArc = useMemo(
    () =>
      describeArc(
        CENTER,
        CENTER,
        TRACK_RADIUS,
        START_ANGLE,
        END_ANGLE
      ),
    []
  );

  function pointerToValue(
    clientX: number,
    clientY: number
  ) {
    if (!svgRef.current) return value;

    const rect =
      svgRef.current.getBoundingClientRect();

    const x = clientX - rect.left - CENTER;
    const y = clientY - rect.top - CENTER;

    let deg =
      (Math.atan2(y, x) * 180) / Math.PI + 90;

    if (deg < 0) deg += 360;

    if (deg < START_ANGLE) deg += 360;

    deg = clamp(deg, START_ANGLE, END_ANGLE);

    const percent =
      (deg - START_ANGLE) / SWEEP;

    return Math.round(
      MIN + percent * (MAX - MIN)
    );
  }

  function update(
    e:
      | React.PointerEvent<SVGSVGElement>
      | PointerEvent
  ) {
    onChange(pointerToValue(e.clientX, e.clientY));
  }

  function down(
    e: React.PointerEvent<SVGSVGElement>
  ) {
    dragging.current = true;
    force((v) => !v);

    update(e);

    window.addEventListener(
      "pointermove",
      move
    );
    window.addEventListener(
      "pointerup",
      up
    );
  }

  function move(e: PointerEvent) {
    if (!dragging.current) return;
    update(e);
  }

  function up() {
    dragging.current = false;
    force((v) => !v);

    window.removeEventListener(
      "pointermove",
      move
    );
    window.removeEventListener(
      "pointerup",
      up
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        className="select-none touch-none cursor-pointer overflow-visible"
        onPointerDown={down}
      >
        <defs>
          <filter
            id="shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="24"
              floodOpacity="0.08"
            />
          </filter>

          <radialGradient
            id="glass"
            cx="50%"
            cy="40%"
          >
            <stop offset="0%" stopColor="#FFFFFF"/>
<stop offset="65%" stopColor="#FCFCFD"/>
<stop offset="100%" stopColor="#F2F2F5"/>
          </radialGradient>

          <linearGradient
            id="progress"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#B8A9FF"
            />
            <stop
              offset="100%"
              stopColor="#6759E8"
            />
          </linearGradient>
        </defs>

        {/* dotted guide */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a =
            START_ANGLE +
            (i / 71) * SWEEP;

          const p =
            polarToCartesian(
              CENTER,
              CENTER,
              OUTER_RADIUS,
              a
            );

          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.8"
              fill="#D7D3E8"
              opacity="0.8"
            />
          );
        })}

        {/* background arc */}
        <path
          d={trackArc}
          fill="none"
          stroke="#E8E5F4"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* active */}
        <path
          d={activeArc}
          fill="none"
          stroke="url(#progress)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* thumb */}
        <g
          transform={`translate(${thumb.x},${thumb.y})`}
        >
          <circle
            r={THUMB_RADIUS}
            fill="#6759E8"
          />

          <path
            d="M-3 -1 L0 3 L5 -4"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* glass center */}
        <g filter="url(#shadow)">
          <circle
            cx={CENTER}
            cy={CENTER}
            r="58"
            fill="url(#glass)"
            stroke="#ECECF2"
            strokeWidth="2"
          />

          <circle
            cx={CENTER}
            cy={CENTER}
            r="66"
            fill="none"
            stroke="#F7F7FA"
            strokeWidth="2"
          />
        </g>

        <text
          x={CENTER}
          y={CENTER + 8}
          textAnchor="middle"
          fill="#5E54E8"
          style={{
            fontSize: 44,
            fontWeight: 600,
          }}
        >
          {value}
        </text>

        <text
          x={CENTER}
          y={CENTER + 36}
          textAnchor="middle"
          className="fill-neutral-500"
          style={{
            fontSize: 16,
          }}
        >
          min
        </text>

        {/* labels */}
        {LABELS.map((n) => {
          const a =
            START_ANGLE +
            ((n - MIN) /
              (MAX - MIN)) *
              SWEEP;

          const p =
            polarToCartesian(
              CENTER,
              CENTER,
              OUTER_RADIUS + 17,
              a
            );

          return (
            <g key={n}>
              <text
                x={p.x}
                y={p.y - 6}
                textAnchor="middle"
                className="fill-neutral-700"
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  
                }}
              >
                {n}
              </text>

            </g>
          );
        })}
      </svg>
    </div>
  );
}