import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CornerLabel, StarIcon } from "@/components/AtmosphereUI";
import bgImage from "@/assets/skies/bg.jpg";

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
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#080c16" }}>
      {/* hand-painted sky background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* foreground/background separation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.22)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(5,8,16,0.55) 100%)",
        }}
      />

      <div className="grain absolute inset-0 pointer-events-none" />

      <CornerLabel position="tl">
        a handmade
        <br />
        constellation tool
      </CornerLabel>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="display-distressed text-[clamp(3.5rem,14vw,10rem)] relative z-10"
          style={{
            lineHeight: 1.15,
            paddingBottom: "0.15em",
            paddingTop: "0.1em",
          }}
        >
          SKYLETTER
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="font-serif italic text-[clamp(1.3rem,2.4vw,1.9rem)] mt-6 text-foreground/90"
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
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 label-mono opacity-70">
        made slowly on earth
      </div>
    </div>
  );
}
