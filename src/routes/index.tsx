import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SkyAtmosphere, AmbientPhrases } from "@/components/SkyAtmosphere";
import { CornerLabel, CrescentMoonIcon, StarIcon } from "@/components/AtmosphereUI";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SKYLETTER — I made you a sky" },
      { name: "description", content: "Build constellations, hide messages in stars, and send someone a universe that exists only for them." },
      { property: "og:title", content: "SKYLETTER — I made you a sky" },
      { property: "og:description", content: "A handmade constellation tool. For people who still feel things deeply." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SkyAtmosphere theme="quiet-night" starCount={180}>
      <CornerLabel position="tl">
        a handmade
        <br />
        constellation tool
      </CornerLabel>
      <div className="absolute top-6 right-6 z-20">
        <CrescentMoonIcon size={48} />
      </div>

      <AmbientPhrases />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* faded huge moon behind logo */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "min(720px, 90vw)",
            height: "min(720px, 90vw)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,244,204,0.18) 0%, rgba(230,212,168,0.06) 35%, transparent 65%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -55%)",
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="display-distressed text-[clamp(4rem,16vw,11rem)] leading-[0.85] relative z-10"
        >
          SKYLETTER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="font-serif italic text-[clamp(1.3rem,2.4vw,1.9rem)] mt-8 text-foreground/90"
        >
          I made you a sky.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.6 }}
          className="font-mono text-xs sm:text-sm mt-10 text-foreground/70 leading-relaxed max-w-md"
        >
          build constellations,
          <br />
          hide messages in stars,
          <br />
          and send someone a universe
          <br />
          that exists only for them.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 2.2 }}
          className="mt-14 flex flex-col items-center gap-6"
        >
          <Link to="/choose-night" className="paper-button group">
            Build a Sky <StarIcon size={11} color="#1a1a1a" />
          </Link>
          <Link
            to="/choose-night"
            className="font-mono text-xs text-foreground/60 underline underline-offset-4 decoration-foreground/30 hover:text-foreground transition-colors"
          >
            view public skies
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 label-mono opacity-70">
        made slowly on earth
      </div>
    </SkyAtmosphere>
  );
}
