// Lightweight client-side store (sessionStorage) used to carry the in-progress
// sky between pages. Once sealed, the sky is persisted to the database.
import type { SkyTheme } from "./themes";

export interface PlacedConstellation {
  id: string; // unique placement id
  shapeId: string; // from CONSTELLATION_LIBRARY
  name: string;
  x: number; // percent
  y: number; // percent
  scale: number;
  hiddenMessage: string;
}

export interface DraftSky {
  theme: SkyTheme;
  skyName: string;
  constellations: PlacedConstellation[];
  letterTo: string;
  letterBody: string;
  letterFrom: string;
  musicUrl?: string;
}

const KEY = "skyletter:draft";

export function getDraft(): DraftSky {
  if (typeof window === "undefined") return defaultDraft();
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultDraft();
    return { ...defaultDraft(), ...JSON.parse(raw) };
  } catch {
    return defaultDraft();
  }
}

export function saveDraft(d: Partial<DraftSky>) {
  if (typeof window === "undefined") return;
  const next = { ...getDraft(), ...d };
  sessionStorage.setItem(KEY, JSON.stringify(next));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

function defaultDraft(): DraftSky {
  return {
    theme: "quiet-night",
    skyName: "the sky for you",
    constellations: [],
    letterTo: "",
    letterBody: "",
    letterFrom: "",
  };
}
