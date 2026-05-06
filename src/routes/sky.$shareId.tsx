import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkyAtmosphere } from "@/components/SkyAtmosphere";
import { ConstellationGraphic } from "@/components/ConstellationGraphic";
import { CONSTELLATION_LIBRARY, THEMES, type SkyTheme } from "@/lib/themes";
import type { PlacedConstellation } from "@/lib/sky-store";
import { supabase } from "@/integrations/supabase/client";
import { Music, X, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SkyRow {
  share_id: string;
  sky_name: string;
  theme: SkyTheme;
  constellations: PlacedConstellation[];
  letter_to: string;
  letter_body: string;
  letter_from: string;
  music_url: string | null;
}

export const Route = createFileRoute("/sky/$shareId")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("skies")
      .select("*")
      .eq("share_id", params.shareId)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { sky: data as unknown as SkyRow };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.sky.sky_name ?? "a sky"} — SKYLETTER` },
      { name: "description", content: "someone made you a sky." },
      { property: "og:title", content: `${loaderData?.sky.sky_name ?? "a sky"} — SKYLETTER` },
      { property: "og:description", content: "made slowly, for you." },
    ],
  }),
  component: Reveal,
  ssr: false,
});

const REVEAL_LINES = ["someone made you a sky", "made slowly,", "for you"];

function Reveal() {
  const data = Route.useLoaderData() as { sky: SkyRow };
  const sky = data.sky;
  const [phase, setPhase] = useState<"intro" | "sky" | "letter-open">("intro");
  const [letterOpen, setLetterOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("sky"), 8500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {phase === "intro" && <Intro />}
      </AnimatePresence>

      {phase !== "intro" && (
        <SkyAtmosphere theme={sky.theme} starCount={220}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-10"
          >
            {/* sky title */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center z-20 px-4">
              <div className="label-mono opacity-60">— made for you —</div>
              <h1 className="display-distressed text-[clamp(2rem,6vw,4.5rem)] mt-2 leading-tight">
                {sky.sky_name.toUpperCase()}
              </h1>
              <p className="font-serif italic text-foreground/70 mt-1">a handmade sky</p>
            </div>

            {/* placed constellations */}
            {sky.constellations.map((item) => {
              const shape = CONSTELLATION_LIBRARY.find((s) => s.id === item.shapeId);
              if (!shape) return null;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, delay: 1 + Math.random() * 1.5 }}
                  className="absolute z-10"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `translate(-50%, -50%) scale(${item.scale})`,
                  }}
                  onClick={() => item.hiddenMessage && setActiveMessage(item.hiddenMessage)}
                >
                  <div className={`relative ${item.hiddenMessage ? "cursor-pointer" : "pointer-events-none"}`}>
                    <ConstellationGraphic
                      shape={shape}
                      size={180}
                      showName
                      name={item.name}
                      starColor={THEMES[sky.theme].starColor}
                    />
                    {item.hiddenMessage && (
                      <span
                        className="absolute -top-2 -right-2 rounded-full glow-pulse"
                        style={{
                          width: 8,
                          height: 8,
                          background: "#fff4cc",
                          boxShadow: "0 0 14px #fff4cc, 0 0 28px rgba(255,244,204,0.5)",
                        }}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}

            {/* hidden message popup */}
            <AnimatePresence>
              {activeMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 z-40 flex items-center justify-center px-6"
                  onClick={() => setActiveMessage(null)}
                >
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="font-serif italic text-2xl sm:text-3xl text-foreground max-w-xl text-center leading-relaxed"
                    style={{ textShadow: "0 0 30px rgba(255,244,204,0.3)" }}
                  >
                    {activeMessage}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* explore stars hint */}
            <div className="absolute right-6 top-1/3 z-20 max-w-[160px] text-right">
              <div className="label-mono opacity-70">explore the stars</div>
              <p className="font-serif italic text-sm opacity-70 mt-2 leading-snug">
                click on the bright stars to find hidden messages.
              </p>
            </div>

            {/* letter floating in */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 2.4, delay: 3, ease: "easeOut" }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
            >
              {!letterOpen ? (
                <button
                  onClick={() => setLetterOpen(true)}
                  className="paper-button"
                >
                  open letter
                </button>
              ) : (
                <LetterPanel sky={sky} onClose={() => setLetterOpen(false)} />
              )}
            </motion.div>

            {/* music player */}
            {sky.music_url && <CassettePlayer url={sky.music_url} />}

            {/* footer actions */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-between px-6 flex-wrap gap-4">
              <button
                onClick={() => window.location.reload()}
                className="paper-button-outline"
              >
                ↻ replay the reveal
              </button>
              <Link to="/" className="paper-button-outline">
                make a sky of your own →
              </Link>
            </div>
          </motion.div>
        </SkyAtmosphere>
      )}

      <div
        className="fixed bottom-1 left-0 right-0 text-center font-serif italic text-xs opacity-50 z-[100] pointer-events-none"
        style={{ color: "#dcccb2" }}
      >
        for people who still feel things deeply — SkyLetter
      </div>
    </div>
  );
}

function Intro() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 z-50 bg-[#050810] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* faint stars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 31) % 100}%`,
            width: 1,
            height: 1,
            background: "#fff4cc",
            opacity: 0.4,
            animation: `star-twinkle ${3 + (i % 5)}s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
      <div className="relative space-y-6 z-10">
        {REVEAL_LINES.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: [0, 1, 1, 0], y: 0, filter: "blur(0px)" }}
            transition={{ duration: 4, delay: i * 2.2, times: [0, 0.2, 0.7, 1] }}
            className="font-serif italic text-2xl sm:text-3xl text-foreground/85 absolute inset-x-0"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

function LetterPanel({ sky, onClose }: { sky: SkyRow; onClose: () => void }) {
  return (
    <motion.div
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      className="paper-letter w-[min(620px,90vw)] p-8 sm:p-12 relative origin-top"
      style={{ transformPerspective: 1000 }}
    >
      <button onClick={onClose} className="absolute top-3 right-3 opacity-60 hover:opacity-100 z-10" style={{ color: "#1a1a1a" }}>
        <X size={16} />
      </button>
      <div className="relative z-10">
        <div className="text-center mb-4">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-60" style={{ color: "#3d2f1f" }}>
            ⋆ open letter ⋆
          </div>
        </div>
        {sky.letter_to && (
          <p className="handwritten mb-3" style={{ fontStyle: "italic" }}>
            To: <span className="border-b border-[#5a4a32]/40 px-2">{sky.letter_to}</span>
          </p>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="handwritten whitespace-pre-wrap"
        >
          {sky.letter_body || "(no words — only stars)"}
        </motion.div>
        {sky.letter_from && (
          <p className="handwritten mt-6 text-right" style={{ fontStyle: "italic" }}>
            from, <span className="border-b border-[#5a4a32]/40 px-2">{sky.letter_from}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}

function CassettePlayer({ url }: { url: string }) {
  const copy = () => {
    navigator.clipboard?.writeText(url);
    toast("song link copied", { duration: 2000 });
  };
  return (
    <div className="absolute top-6 right-6 z-30">
      <button
        onClick={copy}
        className="flex items-center gap-2 px-3 py-2 text-xs font-mono"
        style={{
          background: "var(--paper-deep)",
          color: "#1a1a1a",
          clipPath: "polygon(2% 8%, 8% 0%, 92% 2%, 100% 12%, 98% 88%, 92% 100%, 8% 98%, 0% 90%)",
          boxShadow: "inset 0 0 0 1px rgba(80,60,30,0.4)",
        }}
        title={url}
      >
        <Music size={12} />
        <span className="hidden sm:inline uppercase tracking-widest">our song</span>
        <span className="w-6 h-3 bg-[#1a1a1a]/20 rounded-sm" />
      </button>
    </div>
  );
}
