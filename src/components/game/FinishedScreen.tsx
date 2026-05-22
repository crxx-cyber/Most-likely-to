"use client";
import { motion } from "framer-motion";
import { Player } from "@/types";
import { AvatarSVG } from "../avatar/AvatarSVG";

interface FinishedScreenProps {
  leaderboard: Player[];
  onPlayAgain: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["#eab308", "#94a3b8", "#cd7c2f"];

export function FinishedScreen({ leaderboard, onPlayAgain }: FinishedScreenProps) {
  const winner = leaderboard[0];

  return (
    <div className="min-h-screen noise-bg flex flex-col items-center justify-center px-4 py-12">
      {winner && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${winner.avatar.bodyColor}15, transparent 60%)`,
          }}
        />
      )}

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="font-display text-xs tracking-[0.4em] text-purple uppercase mb-3">Game Over</p>
          <h2 className="font-display text-5xl font-bold text-text-primary">FINAL</h2>
          <h2 className="font-display text-5xl font-bold"
            style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            STANDINGS
          </h2>
        </motion.div>

        {/* Winner spotlight */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.35, delay: 0.2 }}
            className="winner-card rounded-2xl p-6 text-center mb-5"
          >
            <p className="font-display text-xs tracking-[0.3em] text-green-neon uppercase mb-4">🏆 MOST LIKELY CHAMPION</p>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-3"
            >
              <AvatarSVG config={winner.avatar} size={120} />
            </motion.div>
            <p className="font-display text-3xl font-bold text-text-primary">{winner.nickname}</p>
            <p className="text-green-neon font-display text-lg mt-1">{winner.score} WINS</p>
          </motion.div>
        )}

        {/* Leaderboard */}
        <div className="glass rounded-2xl p-5 mb-6">
          <p className="font-display text-xs tracking-widest text-text-muted uppercase mb-4">Leaderboard</p>
          <div className="flex flex-col gap-2">
            {leaderboard.map((player, i) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  i === 0 ? "bg-yellow-400/5 border border-yellow-400/20" : "bg-surface-3/40 border border-transparent"
                }`}
              >
                <span className="text-xl w-6 text-center">{MEDALS[i] || `#${i + 1}`}</span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `${player.avatar.bodyColor}20`,
                    border: `1px solid ${player.avatar.bodyColor}40`,
                  }}
                >
                  <AvatarSVG config={player.avatar} size={36} />
                </div>
                <p className="flex-1 font-body font-semibold text-text-primary">{player.nickname}</p>
                <div className="text-right">
                  <p
                    className="font-display font-bold text-lg"
                    style={{ color: RANK_COLORS[i] || "#888" }}
                  >
                    {player.score}
                  </p>
                  <p className="text-xs text-text-muted">wins</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Play again */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <button onClick={onPlayAgain} className="btn-primary w-full py-4 text-base">
            PLAY AGAIN
          </button>
        </motion.div>
      </div>
    </div>
  );
}
