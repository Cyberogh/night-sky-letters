import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { THEMES, type SkyTheme } from "@/lib/themes";

interface Props {
  theme: SkyTheme;
  starCount?: number;
  showMoon?: boolean;
  children?: React.ReactNode;
  dim?: boolean;
}

export function SkyAtmosphere({
  theme,
  starCount = 120,
  showMoon = true,
  children,
  dim = false,
}: Props) {
  const cfg = THEMES[theme];

  // Stable random stars per theme
  const stars = useMemo(() => {
    const arr: Array<{ x: number; y: number; size: number; delay: number; dur: number; bright: boolean }> = [];
    let seed = theme.length * 13;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < starCount; i++) {
      arr.push({
        x: rand() * 100,
        y: rand() * 100,
        size: rand() * 2 + 0.4,
        delay: rand() * 6,
        dur: 3 + rand() * 5,
        bright: rand() > 0.85,
      });
    }
    return arr;
  }, [theme, starCount]);

  const clouds = useMemo(() => {
    let seed = theme.length * 27 + 5;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 5 }).map(() => ({
      x: rand() * 100,
      y: rand() * 80,
      size: 200 + rand() * 350,
      delay: rand() * 10,
    }));
  }, [theme]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: cfg.bgImage
          ? `${cfg.gradient}`
          : cfg.gradient,
      }}
    >
      {cfg.bgImage && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${cfg.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.85,
            }}
          />
          {/* subtle foreground/background separation */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.42) 100%)",
            }}
          />
        </>
      )}
      {/* watercolor clouds */}
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="watercolor-cloud"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size * 0.6}px`,
            background: cfg.cloudColor,
          }}
          animate={{
            x: [0, 30, -10, 0],
            y: [0, -10, 15, 0],
          }}
          transition={{
            duration: 40 + i * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: c.delay,
          }}
        />
      ))}

      {/* stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: cfg.starColor,
              boxShadow: s.bright
                ? `0 0 ${s.size * 4}px ${cfg.starColor}, 0 0 ${s.size * 8}px rgba(255,244,204,0.3)`
                : `0 0 ${s.size * 2}px ${cfg.starColor}`,
              opacity: s.bright ? 0.9 : 0.5,
              animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* moon — only when no bg image (image already contains a moon) */}
      {showMoon && cfg.moon !== "none" && !cfg.bgImage && <Moon variant={cfg.moon} />}

      {/* rain overlay for rainy theme */}
      {cfg.rain && <Rain />}

      {/* mountain silhouette at bottom — skip when bg image provides scenery */}
      {!cfg.bgImage && (
        <>
          <div
            className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(8,12,22,0.3) 40%, rgba(5,8,18,0.85) 80%, #050810 100%)",
            }}
          />
          <MountainSilhouette />
        </>
      )}

      {/* dim overlay */}
      {dim && <div className="absolute inset-0 bg-black/40 pointer-events-none" />}

      {/* grain */}
      <div className="grain absolute inset-0 pointer-events-none" />

      {children}
    </div>
  );
}

function Moon({ variant }: { variant: "full" | "crescent" | "small-full" }) {
  const isCrescent = variant === "crescent";
  const size = variant === "small-full" ? 90 : 200;
  return (
    <div
      className="absolute moon-breathe drift-slow"
      style={{
        right: variant === "small-full" ? "12%" : "8%",
        top: variant === "small-full" ? "8%" : "10%",
        width: size,
        height: size,
      }}
    >
      <div
        className="w-full h-full rounded-full relative"
        style={{
          background: isCrescent
            ? "radial-gradient(circle at 70% 50%, #f3ebd3 0%, #c9b89a 40%, #5a4a32 80%)"
            : "radial-gradient(circle at 35% 30%, #fff4cc 0%, #e6d4a8 35%, #a08a64 75%, #4a3d28 100%)",
          boxShadow: "0 0 80px rgba(255,244,204,0.15), inset -20px -20px 40px rgba(0,0,0,0.4)",
        }}
      >
        {isCrescent && (
          <div
            className="absolute rounded-full"
            style={{
              inset: "0",
              background: "radial-gradient(circle at 30% 50%, #131827 0%, #131827 45%, transparent 55%)",
            }}
          />
        )}
        {/* craters */}
        <div className="absolute inset-0 rounded-full opacity-30 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 35%, #4a3d28 2%, transparent 4%), radial-gradient(circle at 60% 60%, #4a3d28 1.5%, transparent 3%), radial-gradient(circle at 70% 30%, #4a3d28 2%, transparent 4%)",
          }}
        />
      </div>
    </div>
  );
}

function MountainSilhouette() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      style={{ height: "20vh", opacity: 0.7 }}
    >
      <path
        d="M0,200 L0,140 L80,110 L160,130 L220,90 L310,120 L400,80 L500,110 L590,70 L680,100 L780,60 L880,95 L980,75 L1080,105 L1180,80 L1280,110 L1360,90 L1440,120 L1440,200 Z"
        fill="#080c16"
      />
      <path
        d="M0,200 L0,170 L100,150 L200,165 L320,140 L450,160 L580,135 L720,158 L860,140 L1000,162 L1140,145 L1280,165 L1440,150 L1440,200 Z"
        fill="#040608"
        opacity="0.9"
      />
      {/* tiny pine trees */}
      {[120, 280, 420, 580, 740, 920, 1100, 1280].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${145 + (i % 3) * 5})`} opacity="0.85">
          <path d="M0,0 L-6,15 L-3,15 L-7,25 L7,25 L3,15 L6,15 Z" fill="#020306" />
        </g>
      ))}
    </svg>
  );
}

function Rain() {
  const [drops, setDrops] = useState<Array<{ x: number; delay: number; dur: number }>>([]);
  useEffect(() => {
    setDrops(
      Array.from({ length: 60 }).map(() => ({
        x: Math.random() * 100,
        delay: Math.random() * 2,
        dur: 0.6 + Math.random() * 0.8,
      })),
    );
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{
            left: `${d.x}%`,
            top: "-10%",
            height: "60px",
            animation: `rain-fall ${d.dur}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Ambient phrases scattered in background
export function AmbientPhrases({ phrases }: { phrases?: string[] }) {
  const list = phrases ?? [
    "you stayed",
    "for your hard days",
    "things i never said",
    "i saw this star",
    "and thought of you",
    "august 3am",
    "we never finished",
    "the night you stayed",
  ];
  const positioned = useMemo(() => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return list.map((p) => ({ p, x: rand() * 80 + 5, y: rand() * 80 + 5 }));
  }, [list.length]);
  return (
    <>
      {positioned.map((it, i) => (
        <span
          key={i}
          className="ambient-phrase"
          style={{ left: `${it.x}%`, top: `${it.y}%`, transform: `rotate(${(i % 3) - 1}deg)` }}
        >
          {it.p}
        </span>
      ))}
    </>
  );
}
