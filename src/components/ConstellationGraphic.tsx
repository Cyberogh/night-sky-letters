import { motion } from "framer-motion";
import type { ConstellationShape } from "@/lib/themes";

interface Props {
  shape: ConstellationShape;
  size?: number;
  glow?: boolean;
  showName?: boolean;
  name?: string;
  starColor?: string;
}

export function ConstellationGraphic({
  shape,
  size = 200,
  glow = true,
  showName = false,
  name,
  starColor = "#fff4cc",
}: Props) {
  return (
    <div
      className="relative pointer-events-none select-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="overflow-visible"
      >
        {/* lines */}
        {shape.lines.map(([a, b], i) => {
          const p1 = shape.points[a];
          const p2 = shape.points[b];
          return (
            <motion.line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={starColor}
              strokeWidth={0.9}
              strokeLinecap="round"
              strokeDasharray="2.5 3.5"
              opacity={0.7}
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
        {/* stars */}
        {shape.points.map((p, i) => (
          <motion.g
            key={i}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          >
            {glow && (
              <circle
                cx={p.x}
                cy={p.y}
                r={6}
                fill={starColor}
                opacity={0.18}
                style={{ filter: "blur(4px)" }}
              />
            )}
            <circle cx={p.x} cy={p.y} r={2.2} fill={starColor} />
            {/* sparkle cross */}
            <line x1={p.x - 4.5} y1={p.y} x2={p.x + 4.5} y2={p.y} stroke={starColor} strokeWidth={0.5} opacity={0.75} strokeLinecap="round" />
            <line x1={p.x} y1={p.y - 4.5} x2={p.x} y2={p.y + 4.5} stroke={starColor} strokeWidth={0.5} opacity={0.75} strokeLinecap="round" />
          </motion.g>
        ))}
      </svg>
      {showName && (name || shape.name) && (
        <div
          className="absolute left-1/2 -translate-x-1/2 font-serif italic text-[15px] sm:text-base whitespace-nowrap"
          style={{
            top: "-0.6rem",
            color: "rgba(248, 240, 218, 0.92)",
            letterSpacing: "0.01em",
            textShadow: "0 0 14px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          {name || shape.name}
        </div>
      )}
    </div>
  );
}
