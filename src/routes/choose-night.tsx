import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { SkyAtmosphere, AmbientPhrases } from "@/components/SkyAtmosphere";
import { THEME_LIST, type SkyTheme } from "@/lib/themes";
import { saveDraft } from "@/lib/sky-store";
import { StarIcon } from "@/components/AtmosphereUI";

export const Route = createFileRoute("/choose-night")({
  head: () => ({
    meta: [
      { title: "Choose your night — SKYLETTER" },
      { name: "description", content: "Every sky carries a different feeling. Choose the one that matches yours." },
    ],
  }),
  component: ChooseNight,
});

function ChooseNight() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SkyTheme | null>(null);

  const handleSelect = (theme: SkyTheme) => {
    setSelected(theme);
    saveDraft({ theme });
    setTimeout(() => {
      navigate({ to: "/build-sky" });
    }, 1200);
  };

  return (
    <SkyAtmosphere theme="quiet-night" starCount={140}>
      <AmbientPhrases
        phrases={[
          "some nights stay with us forever",
          "we never finished that conversation",
          "you looked beautiful that night",
          "some people become constellations",
          "if stars could talk, they'd tell your name",
        ]}
      />

      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="label-mono hover:text-star transition-colors">
          ← back to home
        </Link>
      </div>
      <div className="absolute top-6 right-6 z-20 label-mono opacity-60">fig. 02</div>

      <div className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-3 opacity-60">
            <span className="h-px w-10 bg-foreground/40" />
            <StarIcon size={10} />
            <span className="h-px w-10 bg-foreground/40" />
          </div>
          <h1 className="display-distressed text-[clamp(2.4rem,7vw,5rem)] leading-tight">
            CHOOSE YOUR NIGHT
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-foreground/75 mt-3">
            every sky carries a different feeling
          </p>
        </motion.div>

        <motion.div
          animate={selected ? { opacity: 0, scale: 1.05, filter: "blur(10px)" } : {}}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          {THEME_LIST.map((t, i) => (
            <NightCard
              key={t.id}
              index={i}
              title={t.title}
              subtitle={t.subtitle}
              number={t.number}
              gradient={t.gradient}
              starColor={t.starColor}
              onClick={() => handleSelect(t.id)}
              isSelected={selected === t.id}
            />
          ))}
        </motion.div>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-black z-30 flex items-center justify-center"
        >
          <p className="font-serif italic text-xl text-foreground/80">
            opening your sky…
          </p>
        </motion.div>
      )}
    </SkyAtmosphere>
  );
}

function NightCard({
  index,
  title,
  subtitle,
  number,
  gradient,
  starColor,
  onClick,
  isSelected,
}: {
  index: number;
  title: string;
  subtitle: string;
  number: string;
  gradient: string;
  starColor: string;
  onClick: () => void;
  isSelected: boolean;
}) {
  const rotation = [-1.5, 1, -0.5, 1.8, -1][index % 5];
  return (
    <motion.button
      initial={{ opacity: 0, y: 30, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation, scale: isSelected ? 1.1 : 1 }}
      transition={{ duration: 1.2, delay: 0.2 + index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -6, rotate: rotation * 0.4, scale: 1.02 }}
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden text-left cursor-pointer"
      style={{
        background: gradient,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(231,217,183,0.1)",
        clipPath:
          "polygon(1% 4%, 4% 0%, 96% 2%, 100% 8%, 99% 92%, 96% 100%, 4% 98%, 0% 90%)",
      }}
    >
      {/* mini stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => {
          const x = (i * 37 + index * 11) % 100;
          const y = (i * 23 + index * 7) % 100;
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: 1.5,
                height: 1.5,
                background: starColor,
                boxShadow: `0 0 4px ${starColor}`,
                animation: `star-twinkle ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* paper-edge texture */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.6' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>\")",
        }}
      />

      <div className="absolute top-3 left-4 label-mono opacity-70">{number}</div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h3 className="display-distressed text-[clamp(1.6rem,4vw,2.6rem)] leading-tight">
          {title.toUpperCase()}
        </h3>
        <p className="font-serif italic text-sm sm:text-base text-foreground/75 mt-1">
          {subtitle}
        </p>
      </div>

      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ boxShadow: `inset 0 0 80px ${starColor}30` }}
      />
    </motion.button>
  );
}
