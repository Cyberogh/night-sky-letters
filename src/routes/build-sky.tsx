import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { SkyAtmosphere } from "@/components/SkyAtmosphere";
import { ConstellationGraphic } from "@/components/ConstellationGraphic";
import {
  CONSTELLATION_LIBRARY,
  THEMES,
} from "@/lib/themes";
import { getDraft, saveDraft, type PlacedConstellation } from "@/lib/sky-store";
import { X, Trash2 } from "lucide-react";

export const Route = createFileRoute("/build-sky")({
  head: () => ({
    meta: [
      { title: "Build the Sky — SKYLETTER" },
      { name: "description", content: "Drag constellations into your sky and hide messages in the stars." },
    ],
  }),
  component: BuildSky,
  ssr: false,
});

function BuildSky() {
  const navigate = useNavigate();
  const [draft] = useState(getDraft());
  const [skyName, setSkyName] = useState(draft.skyName);
  const [placed, setPlaced] = useState<PlacedConstellation[]>(draft.constellations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveDraft({ skyName, constellations: placed });
  }, [skyName, placed]);

  const themeCfg = THEMES[draft.theme];

  const addConstellation = (shapeId: string) => {
    const shape = CONSTELLATION_LIBRARY.find((s) => s.id === shapeId)!;
    const newOne: PlacedConstellation = {
      id: nanoid(8),
      shapeId,
      name: shape.name,
      x: 30 + Math.random() * 40,
      y: 25 + Math.random() * 40,
      scale: 1,
      hiddenMessage: "",
    };
    setPlaced((p) => [...p, newOne]);
    setSelectedId(newOne.id);
  };

  const updatePlaced = (id: string, patch: Partial<PlacedConstellation>) => {
    setPlaced((p) => p.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removePlaced = (id: string) => {
    setPlaced((p) => p.filter((it) => it.id !== id));
    setSelectedId(null);
  };

  const selected = placed.find((p) => p.id === selectedId);

  const handleDragStart = (e: React.PointerEvent, id: string) => {
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const stage = stageRef.current!.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const item = placed.find((p) => p.id === id)!;
    const origX = item.x;
    const origY = item.y;

    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / stage.width) * 100;
      const dy = ((ev.clientY - startY) / stage.height) * 100;
      updatePlaced(id, {
        x: Math.max(2, Math.min(95, origX + dx)),
        y: Math.max(5, Math.min(90, origY + dy)),
      });
    };
    const up = () => {
      el.removeEventListener("pointermove", move as any);
      el.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointermove", move as any);
    el.addEventListener("pointerup", up);
  };

  return (
    <SkyAtmosphere theme={draft.theme} starCount={200}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between">
        <Link to="/choose-night" className="label-mono hover:text-star transition-colors">
          ← back to choose night
        </Link>
        <div className="text-center label-mono opacity-70">name your sky</div>
        <div className="flex items-center gap-4">
          <span className="label-mono opacity-60">
            stars: {placed.length} / ∞
          </span>
          <button
            onClick={() => navigate({ to: "/write-letter" })}
            className="paper-button-outline"
          >
            preview sky →
          </button>
        </div>
      </div>

      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 text-center">
        <input
          value={skyName}
          onChange={(e) => setSkyName(e.target.value.slice(0, 80))}
          className="bg-transparent text-center font-serif italic text-2xl sm:text-3xl text-foreground/90 outline-none border-b border-foreground/20 focus:border-foreground/60 transition-colors px-4 pb-1 min-w-[280px]"
        />
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="absolute inset-0 z-10"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedId(null);
        }}
      >
        {placed.map((item) => {
          const shape = CONSTELLATION_LIBRARY.find((s) => s.id === item.shapeId)!;
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelectedId(item.id);
                handleDragStart(e, item.id);
              }}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) scale(${item.scale})`,
                touchAction: "none",
              }}
            >
              <div className={`relative ${isSelected ? "ring-1 ring-foreground/30 rounded-lg" : ""}`}>
                <ConstellationGraphic
                  shape={shape}
                  size={180}
                  showName
                  name={item.name}
                  starColor={themeCfg.starColor}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tools sidebar */}
      <ToolsPanel onAdd={addConstellation} />

      {/* Inspector */}
      <AnimatePresence>
        {selected && (
          <Inspector
            key={selected.id}
            item={selected}
            onUpdate={(patch) => updatePlaced(selected.id, patch)}
            onRemove={() => removePlaced(selected.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 paper-button-outline text-center max-w-md">
        tip: drag constellations · click to add a hidden message
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={() => navigate({ to: "/write-letter" })}
          className="paper-button-outline"
        >
          next: write a letter →
        </button>
      </div>
    </SkyAtmosphere>
  );
}

function ToolsPanel({ onAdd }: { onAdd: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="absolute left-4 top-32 bottom-32 z-20 w-44 sm:w-52 overflow-y-auto"
      style={{
        background:
          "radial-gradient(ellipse at center, var(--paper-light), var(--paper-deep))",
        clipPath: "polygon(2% 1%, 98% 0%, 100% 99%, 1% 98%)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        color: "#1a1a1a",
        padding: "1rem 0.75rem",
      }}
    >
      <div className="text-center label-mono mb-3" style={{ color: "#3d2f1f" }}>
        Constellations
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CONSTELLATION_LIBRARY.map((s) => (
          <button
            key={s.id}
            onClick={() => onAdd(s.id)}
            className="aspect-square bg-[#1a2035]/90 rounded p-1 hover:bg-[#1a2035] transition-colors group relative"
            title={s.name}
          >
            <ConstellationGraphic shape={s} size={70} glow={false} />
            <span
              className="absolute bottom-1 left-1 right-1 text-[8px] text-center font-mono opacity-0 group-hover:opacity-100 transition-opacity text-foreground"
            >
              {s.name}
            </span>
          </button>
        ))}
      </div>
      <p className="font-serif italic text-xs mt-4 opacity-60 text-center" style={{ color: "#3d2f1f" }}>
        tap to drop into your sky
      </p>
    </motion.div>
  );
}

function Inspector({
  item,
  onUpdate,
  onRemove,
  onClose,
}: {
  item: PlacedConstellation;
  onUpdate: (p: Partial<PlacedConstellation>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4 }}
      className="absolute right-4 top-32 z-30 w-72"
      style={{
        background:
          "radial-gradient(ellipse at center, var(--paper-light), var(--paper-deep))",
        clipPath: "polygon(2% 1%, 98% 0%, 100% 99%, 1% 98%)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        color: "#1a1a1a",
        padding: "1.25rem",
      }}
    >
      <button onClick={onClose} className="absolute top-2 right-2 opacity-60 hover:opacity-100">
        <X size={16} />
      </button>
      <div className="label-mono" style={{ color: "#3d2f1f" }}>
        ⋆ constellation
      </div>
      <input
        value={item.name}
        onChange={(e) => onUpdate({ name: e.target.value.slice(0, 60) })}
        className="w-full bg-transparent border-b border-[#3d2f1f]/30 font-serif italic text-lg mt-2 pb-1 outline-none focus:border-[#3d2f1f]/70"
      />
      <div className="label-mono mt-5" style={{ color: "#3d2f1f" }}>
        hidden message
      </div>
      <textarea
        value={item.hiddenMessage}
        onChange={(e) => onUpdate({ hiddenMessage: e.target.value.slice(0, 280) })}
        rows={4}
        placeholder="something only the stars know…"
        className="w-full mt-2 bg-[#f5ecd3]/60 border border-[#3d2f1f]/20 p-2 font-serif italic text-sm outline-none focus:border-[#3d2f1f]/60 resize-none placeholder:italic placeholder:opacity-50"
        style={{ color: "#1a1a1a" }}
      />
      <div className="label-mono mt-5" style={{ color: "#3d2f1f" }}>
        size
      </div>
      <input
        type="range"
        min={0.5}
        max={1.8}
        step={0.05}
        value={item.scale}
        onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
        className="w-full mt-1 accent-[#3d2f1f]"
      />
      <button
        onClick={onRemove}
        className="mt-5 flex items-center gap-2 text-xs font-mono opacity-70 hover:opacity-100"
        style={{ color: "#3d2f1f" }}
      >
        <Trash2 size={12} /> delete constellation
      </button>
    </motion.div>
  );
}
