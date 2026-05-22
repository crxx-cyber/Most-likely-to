"use client";
import { motion } from "framer-motion";
import { Player } from "@/types";
import { AvatarSVG } from "../avatar/AvatarSVG";

interface ResultsScreenProps {
  question: string;
  tally: Record<string, number>;
  winner: Player | null;
  players: Player[];
  isHost: boolean;
  questionIndex: number;
  totalQuestions: number;
  onNext: () => void;
}

export function ResultsScreen({
  question,
  tally,
  winner,
  players,
  isHost,
  questionIndex,
  totalQuestions,
  onNext,
}: ResultsScreenProps) {
  const sorted = [...players]
    .filter((p) => (tally[p.id] || 0) > 0)
    .sort((a, b) => (tally[b.id] || 0) - (tally[a.id] || 0));

  const totalVotes = Object.values(tally).reduce((a, b) => a + b, 0);
  const isLastQuestion = questionIndex + 1 >= totalQuestions;

  return (
    <div className="min-h-screen noise-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Winner glow */}
      {winner && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${winner.avatar.bodyColor}10, transparent 70%)`,
          }}
        />
      )}

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-6 appear">
          <span className="tag">RESULTS · {questionIndex + 1}/{totalQuestions}</span>
          <p className="text-text-secondary text-sm mt-3 italic">"{question}"</p>
        </div>

        {/* Winner */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.7 }}
            className="text-center mb-6"
          >
            <p className="font-display text-xs tracking-[0.3em] text-green-neon uppercase mb-4">
              🏆 THE WINNER IS
            </p>
            <div
              className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl winner-card"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <AvatarSVG config={winner.avatar} size={100} />
              </motion.div>
              <div>
                <p className="font-display text-2xl font-bold text-text-primary">{winner.nickname}</p>
                <p className="text-green-neon text-sm font-display tracking-wider mt-1">
                  {tally[winner.id] || 0} / {totalVotes} VOTES
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* All results */}
        {sorted.length > 1 && (
          <div className="glass rounded-2xl p-5 mb-5 appear appear-delay-1">
            <p className="font-display text-xs tracking-widest text-text-muted uppercase mb-4">All Votes</p>
            <div className="flex flex-col gap-3">
              {sorted.map((player, i) => {
                const votes = tally[player.id] || 0;
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${player.avatar.bodyColor}25`, border: `1px solid ${player.avatar.bodyColor}40` }}>
                      <AvatarSVG config={player.avatar} size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-text-primary truncate">{player.nickname}</p>
                        <p className="text-xs font-display text-text-secondary ml-2">{votes} vote{votes !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: i === 0 ? "#4ade80" : player.avatar.bodyColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1 + 0.5 }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-display text-text-muted w-10 text-right">{pct}%</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scores */}
        <div className="glass rounded-xl p-4 mb-5 appear appear-delay-2">
          <p className="font-display text-xs tracking-widest text-text-muted uppercase mb-3">Running Score</p>
          <div className="flex flex-wrap gap-2">
            {[...players].sort((a, b) => b.score - a.score).map((p) => (
              <div key={p.id} className="flex items-center gap-2 bg-surface-3 px-3 py-1.5 rounded-lg">
                <AvatarSVG config={p.avatar} size={20} />
                <span className="text-sm text-text-secondary">{p.nickname}</span>
                <span className="font-display font-bold text-purple text-sm">{p.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next button (host only) */}
        {isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button onClick={onNext} className="btn-primary w-full py-4 text-base">
              {isLastQuestion ? "SEE FINAL RESULTS →" : "NEXT QUESTION →"}
            </button>
          </motion.div>
        )}

        {!isHost && (
          <div className="glass rounded-xl p-4 text-center appear appear-delay-3">
            <p className="text-text-muted text-xs font-display tracking-wider">Waiting for host to continue...</p>
          </div>
        )}
      </div>
    </div>
  );
}
