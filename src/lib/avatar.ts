import { AvatarConfig } from "@/types";

export const BODY_COLORS = [
  "#a855f7", // purple
  "#22d3ee", // cyan
  "#4ade80", // green
  "#f97316", // orange
  "#f43f5e", // rose
  "#eab308", // yellow
  "#3b82f6", // blue
  "#ec4899", // pink
];

export const ACCENT_COLORS = [
  "#ffffff",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
];

export const DEFAULT_AVATAR: AvatarConfig = {
  bodyShape: "round",
  bodyColor: "#a855f7",
  eyeStyle: "normal",
  mouthStyle: "smile",
  accessory: "none",
  accentColor: "#ffffff",
};

export function randomAvatar(): AvatarConfig {
  const bodyColors = BODY_COLORS;
  const eyeStyles: AvatarConfig["eyeStyle"][] = ["normal", "happy", "sleepy", "surprised", "cool"];
  const mouthStyles: AvatarConfig["mouthStyle"][] = ["smile", "grin", "neutral", "open", "smirk"];
  const accessories: AvatarConfig["accessory"][] = ["none", "hat", "glasses", "crown", "headphones"];
  const bodyShapes: AvatarConfig["bodyShape"][] = ["round", "square", "blob"];

  return {
    bodyShape: bodyShapes[Math.floor(Math.random() * bodyShapes.length)],
    bodyColor: bodyColors[Math.floor(Math.random() * bodyColors.length)],
    eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
    mouthStyle: mouthStyles[Math.floor(Math.random() * mouthStyles.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)],
    accentColor: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
  };
}
