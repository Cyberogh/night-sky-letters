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
              strokeWidth={0.5}
              strokeDasharray="2 3"
              opacity={0.5}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
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
            <circle cx={p.x} cy={p.y} r={1.6} fill={starColor} />
            {/* sparkle cross */}
            <line x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} stroke={starColor} strokeWidth={0.3} opacity={0.6} />
            <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 4} stroke={starColor} strokeWidth={0.3} opacity={0.6} />
          </motion.g>
        ))}
      </svg>
      {showName && (name || shape.name) && (
        <div
          className="absolute left-1/2 -translate-x-1/2 font-serif italic text-sm whitespace-nowrap"
          style={{
            top: "-0.5rem",
            color: "rgba(243, 235, 211, 0.7)",
            textShadow: "0 0 12px rgba(0,0,0,0.6)",
          }}
        >
          {name || shape.name}
        </div>
      )}
    </div>
  );
}
