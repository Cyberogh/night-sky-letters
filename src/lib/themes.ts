export type SkyTheme =
  | "quiet-night"
  | "dreamy-sky"
  | "deep-space"
  | "golden-midnight"
  | "rainy-window";

export interface ThemeConfig {
  id: SkyTheme;
  title: string;
  subtitle: string;
  number: string;
  // gradient stops for the sky
  gradient: string;
  // accent for stars/clouds
  starColor: string;
  cloudColor: string;
  // moon style
  moon: "full" | "crescent" | "none" | "small-full";
  rain?: boolean;
  bgImage?: string;
}

import quietNightBg from "@/assets/skies/quiet-night.jpg";
import dreamySkyBg from "@/assets/skies/dreamy-sky.jpg";
import deepSpaceBg from "@/assets/skies/deep-space.jpg";
import goldenMidnightBg from "@/assets/skies/golden-midnight.jpg";
import rainyWindowBg from "@/assets/skies/rainy-window.jpg";

export const THEMES: Record<SkyTheme, ThemeConfig> = {
  "quiet-night": {
    id: "quiet-night",
    title: "Quiet Night",
    subtitle: "for things softly felt",
    number: "01",
    gradient:
      "radial-gradient(ellipse at 70% 20%, #1f2742 0%, #131827 60%), linear-gradient(180deg, #131827 0%, #0c1020 100%)",
    starColor: "#fff4cc",
    cloudColor: "rgba(141, 163, 199, 0.18)",
    moon: "full",
    bgImage: quietNightBg,
  },
  "dreamy-sky": {
    id: "dreamy-sky",
    title: "Dreamy Sky",
    subtitle: "for impossible feelings",
    number: "02",
    gradient:
      "radial-gradient(ellipse at 30% 30%, #3d2a4d 0%, #1f1530 50%, #0f0a1a 100%)",
    starColor: "#ffe8a3",
    cloudColor: "rgba(199, 184, 227, 0.22)",
    moon: "crescent",
    bgImage: dreamySkyBg,
  },
  "deep-space": {
    id: "deep-space",
    title: "Deep Space",
    subtitle: "for endless thoughts",
    number: "03",
    gradient:
      "radial-gradient(ellipse at 60% 50%, #2a1a3d 0%, #100818 60%, #050308 100%)",
    starColor: "#fff4cc",
    cloudColor: "rgba(199, 184, 227, 0.15)",
    moon: "none",
    bgImage: deepSpaceBg,
  },
  "golden-midnight": {
    id: "golden-midnight",
    title: "Golden Midnight",
    subtitle: "for memories that glow",
    number: "04",
    gradient:
      "radial-gradient(ellipse at 50% 40%, #4a3520 0%, #2a1d10 55%, #14100a 100%)",
    starColor: "#ffe8a3",
    cloudColor: "rgba(230, 198, 168, 0.22)",
    moon: "crescent",
    bgImage: goldenMidnightBg,
  },
  "rainy-window": {
    id: "rainy-window",
    title: "Rainy Window",
    subtitle: "for nights that stayed too long",
    number: "05",
    gradient:
      "radial-gradient(ellipse at 50% 30%, #1a2438 0%, #0d121e 60%, #060810 100%)",
    starColor: "#dcccb2",
    cloudColor: "rgba(141, 163, 199, 0.25)",
    moon: "small-full",
    rain: true,
    bgImage: rainyWindowBg,
  },
};

export const THEME_LIST = Object.values(THEMES);

// Pre-made constellation assets
export interface ConstellationShape {
  id: string;
  name: string;
  // SVG-style points relative to a 200x200 box
  points: Array<{ x: number; y: number }>;
  // connections (pairs of indexes)
  lines: Array<[number, number]>;
}

export const CONSTELLATION_LIBRARY: ConstellationShape[] = [
  {
    id: "the-listener",
    name: "the listener",
    points: [
      { x: 20, y: 40 },
      { x: 60, y: 20 },
      { x: 100, y: 50 },
      { x: 140, y: 30 },
      { x: 170, y: 80 },
      { x: 130, y: 110 },
      { x: 80, y: 130 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2],
    ],
  },
  {
    id: "you-stayed",
    name: "you stayed",
    points: [
      { x: 30, y: 30 },
      { x: 90, y: 50 },
      { x: 150, y: 40 },
      { x: 110, y: 100 },
      { x: 60, y: 130 },
      { x: 160, y: 130 },
    ],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [3, 5]],
  },
  {
    id: "first-coffee",
    name: "first coffee",
    points: [
      { x: 40, y: 60 },
      { x: 80, y: 30 },
      { x: 120, y: 50 },
      { x: 160, y: 90 },
      { x: 100, y: 120 },
      { x: 50, y: 130 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    id: "late-night-talks",
    name: "our late night talks",
    points: [
      { x: 30, y: 80 },
      { x: 70, y: 40 },
      { x: 130, y: 50 },
      { x: 170, y: 90 },
      { x: 140, y: 140 },
      { x: 70, y: 140 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    id: "the-day-we-met",
    name: "the day we met",
    points: [
      { x: 100, y: 20 },
      { x: 50, y: 80 },
      { x: 100, y: 130 },
      { x: 150, y: 80 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    id: "the-almost",
    name: "the almost",
    points: [
      { x: 30, y: 100 },
      { x: 80, y: 60 },
      { x: 120, y: 90 },
      { x: 170, y: 60 },
    ],
    lines: [[0, 1], [1, 2], [2, 3]],
  },
  {
    id: "home",
    name: "home",
    points: [
      { x: 40, y: 120 },
      { x: 80, y: 60 },
      { x: 120, y: 30 },
      { x: 160, y: 60 },
      { x: 170, y: 120 },
      { x: 100, y: 140 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    id: "your-laugh",
    name: "your laugh",
    points: [
      { x: 30, y: 80 },
      { x: 70, y: 50 },
      { x: 110, y: 70 },
      { x: 150, y: 40 },
      { x: 180, y: 90 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
];
