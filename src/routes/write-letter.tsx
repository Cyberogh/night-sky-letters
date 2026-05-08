import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { SkyAtmosphere } from "@/components/SkyAtmosphere";
import { getDraft, saveDraft, clearDraft } from "@/lib/sky-store";
import { supabase } from "@/integrations/supabase/client";
import { Music } from "lucide-react";
import { toast } from "sonner";
import { SupportTip } from "@/components/SupportTip";

export const Route = createFileRoute("/write-letter")({
  head: () => ({
    meta: [
      { title: "Write your letter — SKYLETTER" },
      { name: "description", content: "Some things are easier beneath the stars." },
    ],
  }),
  component: WriteLetter,
  ssr: false,
});

function WriteLetter() {
  const navigate = useNavigate();
  const [draft] = useState(getDraft());
  const [letterTo, setLetterTo] = useState(draft.letterTo);
  const [letterFrom, setLetterFrom] = useState(draft.letterFrom);
  const [letterBody, setLetterBody] = useState(draft.letterBody);
  const [musicUrl, setMusicUrl] = useState(draft.musicUrl ?? "");
  const [sealing, setSealing] = useState(false);

  useEffect(() => {
    saveDraft({ letterTo, letterFrom, letterBody, musicUrl: musicUrl || undefined });
  }, [letterTo, letterFrom, letterBody, musicUrl]);

  const handleSeal = async () => {
    setSealing(true);
    const shareId = nanoid(8).toUpperCase();
    const current = getDraft();
    const { error } = await supabase.from("skies").insert({
      share_id: shareId,
      sky_name: current.skyName.slice(0, 120) || "a sky for you",
      theme: current.theme,
      constellations: current.constellations as any,
      letter_to: letterTo.slice(0, 120),
      letter_body: letterBody.slice(0, 5000),
      letter_from: letterFrom.slice(0, 120),
      music_url: musicUrl ? musicUrl.slice(0, 500) : null,
    });
    if (error) {
      console.error(error);
      toast.error("the stars couldn't catch your sky. try again.");
      setSealing(false);
      return;
    }
    setTimeout(() => {
      clearDraft();
      navigate({ to: "/sky/$shareId", params: { shareId } });
    }, 2400);
  };

  return (
    <div className="relative w-full h-[100svh] min-h-[640px] overflow-hidden">
      <SkyAtmosphere theme={draft.theme} starCount={120} dim>
        <TypingStars typingKey={letterBody.length} />

        {/* Top bar */}
        <div className="absolute top-3 sm:top-4 left-0 right-0 z-30 flex items-start justify-between px-4 sm:px-6">
          <Link to="/build-sky" className="label-mono hover:text-star transition-colors mt-1">
            ← back
          </Link>
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4 }}
              className="display-distressed text-lg sm:text-2xl leading-tight"
            >
              WRITE YOUR LETTER
            </motion.h1>
            <p className="font-serif italic text-[11px] sm:text-sm text-foreground/70">
              some things are easier beneath the stars
            </p>
          </div>
          <div className="w-10 sm:w-16" />
        </div>

        {/* Centered letter — fits one viewport */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 pt-20 pb-24 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -1.2 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="paper-letter w-full max-w-xl p-6 sm:p-10 relative"
          >
            <div className="relative z-10">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">To:</span>
                <input
                  value={letterTo}
                  onChange={(e) => setLetterTo(e.target.value)}
                  placeholder="you"
                  className="flex-1 bg-transparent handwritten outline-none border-b border-[#5a4a32]/40 focus:border-[#5a4a32] pb-1"
                  style={{ fontStyle: "italic" }}
                />
              </div>

              <textarea
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                placeholder="there were things i wanted to tell you,
but i never knew how.
so i made you a sky instead."
                rows={6}
                className="w-full bg-transparent handwritten outline-none resize-none placeholder:italic placeholder:opacity-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 29px, rgba(90,74,50,0.18) 30px)",
                  lineHeight: "30px",
                  paddingTop: "2px",
                }}
              />

              <div className="flex items-baseline gap-3 mt-3 justify-end">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">From:</span>
                <input
                  value={letterFrom}
                  onChange={(e) => setLetterFrom(e.target.value)}
                  placeholder="me"
                  className="bg-transparent handwritten outline-none border-b border-[#5a4a32]/40 focus:border-[#5a4a32] pb-1 text-right w-32"
                  style={{ fontStyle: "italic" }}
                />
              </div>

              {/* music input — inline & subtle */}
              <div className="mt-4 pt-3 border-t border-[#5a4a32]/20 flex items-center gap-2">
                <Music size={12} className="opacity-60 shrink-0" style={{ color: "#5a4a32" }} />
                <input
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  placeholder="add a song — Spotify or YouTube link (optional)"
                  className="flex-1 bg-transparent outline-none font-mono text-[11px] placeholder:opacity-40"
                  style={{ color: "#3d2f1f" }}
                />
              </div>

              <svg className="absolute bottom-1 right-1 opacity-50" width="48" height="48" viewBox="0 0 60 60">
                <path d="M30,55 Q28,40 30,25 Q32,15 30,5" stroke="#5a4a32" strokeWidth="0.6" fill="none" />
                <path d="M30,40 Q22,35 18,28" stroke="#5a4a32" strokeWidth="0.5" fill="none" />
                <path d="M30,30 Q38,26 42,18" stroke="#5a4a32" strokeWidth="0.5" fill="none" />
                <ellipse cx="18" cy="28" rx="3" ry="1.5" fill="#5a4a32" opacity="0.5" transform="rotate(-30 18 28)" />
                <ellipse cx="42" cy="18" rx="3" ry="1.5" fill="#5a4a32" opacity="0.5" transform="rotate(30 42 18)" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Bottom seal bar */}
        <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-3 sm:gap-5 px-4 flex-wrap">
          <span className="hidden sm:inline font-serif italic text-xs text-foreground/60">
            take your time. there's no rush here.
          </span>
          <button
            onClick={handleSeal}
            disabled={sealing}
            className="paper-button gap-2 disabled:opacity-50 text-sm"
          >
            <span>SEAL THE LETTER</span>
            <span className="wax-seal" style={{ width: 22, height: 22, fontSize: 8 }}>★</span>
          </button>
          <SupportTip />
        </div>

        <AnimatePresence>
          {sealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="font-serif italic text-2xl sm:text-3xl text-foreground/80"
              >
                your sky is ready…
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </SkyAtmosphere>
    </div>
  );
}

function TypingStars({ typingKey }: { typingKey: number }) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  useEffect(() => {
    if (typingKey === 0) return;
    if (typingKey % 8 !== 0) return;
    const id = Date.now();
    setBursts((b) => [...b.slice(-6), { id, x: Math.random() * 90 + 5, y: Math.random() * 80 + 5 }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 4000);
  }, [typingKey]);
  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      {bursts.map((b) => (
        <motion.span
          key={b.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 1] }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: 4,
            height: 4,
            background: "#fff4cc",
            boxShadow: "0 0 16px #fff4cc, 0 0 32px rgba(255,244,204,0.4)",
          }}
        />
      ))}
    </div>
  );
}
