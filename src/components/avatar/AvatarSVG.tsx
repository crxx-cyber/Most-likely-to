"use client";
import { AvatarConfig } from "@/types";

interface AvatarSVGProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
  animate?: boolean;
}

export function AvatarSVG({ config, size = 80, className = "", animate = false }: AvatarSVGProps) {
  const { bodyShape, bodyColor, eyeStyle, mouthStyle, accessory, accentColor } = config;

  const getBodyPath = () => {
    if (bodyShape === "square") return <rect x="10" y="20" width="80" height="70" rx="16" fill={bodyColor} />;
    if (bodyShape === "blob") return (
      <path
        d="M50 18 C72 18, 88 32, 88 52 C88 68, 80 80, 68 85 C60 88, 40 88, 32 85 C20 80, 12 68, 12 52 C12 32, 28 18, 50 18Z"
        fill={bodyColor}
      />
    );
    return <circle cx="50" cy="56" r="38" fill={bodyColor} />;
  };

  const getEyes = () => {
    const baseColor = accentColor;
    switch (eyeStyle) {
      case "happy":
        return (
          <>
            <path d="M34 46 Q38 42 42 46" stroke={baseColor} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M58 46 Q62 42 66 46" stroke={baseColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case "sleepy":
        return (
          <>
            <line x1="33" y1="46" x2="42" y2="46" stroke={baseColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="58" y1="46" x2="67" y2="46" stroke={baseColor} strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case "surprised":
        return (
          <>
            <circle cx="37" cy="46" r="5" fill={baseColor} />
            <circle cx="63" cy="46" r="5" fill={baseColor} />
            <circle cx="39" cy="44" r="1.5" fill={bodyColor} />
            <circle cx="65" cy="44" r="1.5" fill={bodyColor} />
          </>
        );
      case "cool":
        return (
          <rect x="30" y="42" width="40" height="8" rx="4" fill={baseColor} opacity="0.9" />
        );
      default:
        return (
          <>
            <circle cx="37" cy="46" r="4" fill={baseColor} />
            <circle cx="63" cy="46" r="4" fill={baseColor} />
            <circle cx="39" cy="44" r="1.5" fill={bodyColor} />
            <circle cx="65" cy="44" r="1.5" fill={bodyColor} />
          </>
        );
    }
  };

  const getMouth = () => {
    const c = accentColor;
    switch (mouthStyle) {
      case "grin":
        return <path d="M34 62 Q50 75 66 62" stroke={c} strokeWidth="3" fill="rgba(0,0,0,0.2)" strokeLinecap="round" />;
      case "neutral":
        return <line x1="38" y1="64" x2="62" y2="64" stroke={c} strokeWidth="3" strokeLinecap="round" />;
      case "open":
        return (
          <>
            <path d="M36 60 Q50 74 64 60" stroke={c} strokeWidth="2.5" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="50" cy="66" rx="12" ry="6" fill="rgba(0,0,0,0.25)" />
          </>
        );
      case "smirk":
        return <path d="M38 64 Q50 70 62 60" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" />;
      default:
        return <path d="M36 62 Q50 72 64 62" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
  };

  const getAccessory = () => {
    switch (accessory) {
      case "hat":
        return (
          <>
            <rect x="26" y="16" width="48" height="6" rx="3" fill={accentColor} opacity="0.9" />
            <rect x="34" y="2" width="32" height="16" rx="6" fill={accentColor} opacity="0.9" />
          </>
        );
      case "glasses":
        return (
          <>
            <circle cx="37" cy="46" r="9" fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.8" />
            <circle cx="63" cy="46" r="9" fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.8" />
            <line x1="46" y1="46" x2="54" y2="46" stroke={accentColor} strokeWidth="2" />
            <line x1="20" y1="46" x2="28" y2="46" stroke={accentColor} strokeWidth="2" />
            <line x1="72" y1="46" x2="80" y2="46" stroke={accentColor} strokeWidth="2" />
          </>
        );
      case "crown":
        return (
          <path d="M26 18 L34 8 L50 16 L66 8 L74 18 L70 22 L30 22Z" fill="#eab308" opacity="0.95" />
        );
      case "headphones":
        return (
          <>
            <path d="M18 46 Q18 22 50 22 Q82 22 82 46" fill="none" stroke={accentColor} strokeWidth="4" />
            <rect x="14" y="44" width="10" height="14" rx="4" fill={accentColor} />
            <rect x="76" y="44" width="10" height="14" rx="4" fill={accentColor} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "animate-float" : ""} ${className}`}
    >
      {/* Glow */}
      <defs>
        <radialGradient id={`glow-${bodyColor.replace("#", "")}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={bodyColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={bodyColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="50"
        cy="80"
        rx="30"
        ry="8"
        fill={`url(#glow-${bodyColor.replace("#", "")})`}
        opacity="0.5"
      />
      {getBodyPath()}
      {getAccessory()}
      {getEyes()}
      {getMouth()}
    </svg>
  );
}
