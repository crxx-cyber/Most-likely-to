"use client";
import { useState } from "react";
import { AvatarConfig } from "@/types";
import { AvatarSVG } from "./AvatarSVG";
import { BODY_COLORS, ACCENT_COLORS, randomAvatar } from "@/lib/avatar";

interface CharacterLabProps {
  initialConfig: AvatarConfig;
  nickname: string;
  onNicknameChange: (v: string) => void;
  onConfirm: (config: AvatarConfig) => void;
}

const BODY_SHAPES: { value: AvatarConfig["bodyShape"]; label: string }[] = [
  { value: "round", label: "Round" },
  { value: "square", label: "Square" },
  { value: "blob", label: "Blob" },
];

const EYE_STYLES: { value: AvatarConfig["eyeStyle"]; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "happy", label: "Happy" },
  { value: "sleepy", label: "Sleepy" },
  { value: "surprised", label: "Surprised" },
  { value: "cool", label: "Cool" },
];

const MOUTH_STYLES: { value: AvatarConfig["mouthStyle"]; label: string }[] = [
  { value: "smile", label: "Smile" },
  { value: "grin", label: "Grin" },
  { value: "neutral", label: "Neutral" },
  { value: "open", label: "Open" },
  { value: "smirk", label: "Smirk" },
];

const ACCESSORIES: { value: AvatarConfig["accessory"]; label: string; icon: string }[] = [
  { value: "none", label: "None", icon: "✕" },
  { value: "hat", label: "Hat", icon: "🎩" },
  { value: "glasses", label: "Glasses", icon: "🕶" },
  { value: "crown", label: "Crown", icon: "👑" },
  { value: "headphones", label: "Headphones", icon: "🎧" },
];

export function CharacterLab({ initialConfig, nickname, onNicknameChange, onConfirm }: CharacterLabProps) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig);

  const update = (key: keyof AvatarConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = nickname.trim().length >= 2;

  return (
    <div className="w-full max-w-2xl mx-auto appear">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="tag mb-3">CHARACTER LAB</span>
        <h2 className="font-display text-3xl font-bold text-text-primary mt-2">Create Your Avatar</h2>
        <p className="text-text-secondary mt-1 text-sm">This is how your friends will see you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Panel */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
          <div
            className="relative w-36 h-36 flex items-center justify-center rounded-2xl"
            style={{
              background: `radial-gradient(circle at center, ${config.bodyColor}20, transparent 70%)`,
              border: `1px solid ${config.bodyColor}30`,
            }}
          >
            <AvatarSVG config={config} size={120} animate />
          </div>

          {/* Nickname */}
          <div className="w-full">
            <label className="text-xs text-text-muted font-display tracking-widest uppercase mb-1 block">Nickname</label>
            <input
              className="input-field text-center font-display text-lg"
              placeholder="Enter name..."
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value.slice(0, 16))}
              maxLength={16}
            />
            {nickname.length > 0 && nickname.trim().length < 2 && (
              <p className="text-xs text-rose-400 mt-1 text-center">Min 2 characters</p>
            )}
          </div>

          {/* Randomize */}
          <button
            onClick={() => setConfig(randomAvatar())}
            className="btn-ghost w-full text-center font-display text-xs tracking-widest"
          >
            🎲 RANDOMIZE
          </button>

          {/* Confirm */}
          <button
            onClick={() => isValid && onConfirm(config)}
            disabled={!isValid}
            className={`btn-primary w-full text-center ${!isValid ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            CONFIRM AVATAR →
          </button>
        </div>

        {/* Customization Panel */}
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
          {/* Body Shape */}
          <Section label="Body Shape">
            <div className="flex gap-2">
              {BODY_SHAPES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => update("bodyShape", s.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-display tracking-wider transition-all border ${
                    config.bodyShape === s.value
                      ? "border-purple bg-purple/10 text-purple"
                      : "border-border text-text-secondary hover:border-border-bright"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Body Color */}
          <Section label="Body Color">
            <div className="flex gap-2 flex-wrap">
              {BODY_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => update("bodyColor", c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    config.bodyColor === c ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-surface" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </Section>

          {/* Eyes */}
          <Section label="Eyes">
            <div className="grid grid-cols-5 gap-1">
              {EYE_STYLES.map((e) => (
                <button
                  key={e.value}
                  onClick={() => update("eyeStyle", e.value)}
                  className={`py-1.5 rounded text-xs font-display tracking-wide transition-all border ${
                    config.eyeStyle === e.value
                      ? "border-cyan bg-cyan/10 text-cyan"
                      : "border-border text-text-muted hover:border-border-bright"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Mouth */}
          <Section label="Mouth">
            <div className="grid grid-cols-5 gap-1">
              {MOUTH_STYLES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => update("mouthStyle", m.value)}
                  className={`py-1.5 rounded text-xs font-display tracking-wide transition-all border ${
                    config.mouthStyle === m.value
                      ? "border-cyan bg-cyan/10 text-cyan"
                      : "border-border text-text-muted hover:border-border-bright"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Accessory */}
          <Section label="Accessory">
            <div className="grid grid-cols-5 gap-1">
              {ACCESSORIES.map((a) => (
                <button
                  key={a.value}
                  onClick={() => update("accessory", a.value)}
                  className={`py-2 rounded-lg text-lg transition-all border ${
                    config.accessory === a.value
                      ? "border-purple bg-purple/10"
                      : "border-border hover:border-border-bright"
                  }`}
                  title={a.label}
                >
                  {a.icon}
                </button>
              ))}
            </div>
          </Section>

          {/* Accent Color */}
          <Section label="Detail Color">
            <div className="flex gap-2 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => update("accentColor", c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    config.accentColor === c
                      ? "scale-110 border-white"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-3">
      <p className="text-xs font-display tracking-widest text-text-muted uppercase mb-2">{label}</p>
      {children}
    </div>
  );
}
