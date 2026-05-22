"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/types";
import { AvatarSVG } from "../avatar/AvatarSVG";

interface VotingScreenProps {
  question: string;
  questionIndex: number;
  totalQuestions: number;
  players: Player[];
  currentPlayerId: string;
  hasVoted: boolean;
  voteCount: number;
  onVote: (targetId: string) => void;
  selectedId: string | null;
}

export function VotingScreen({
  question,
  questionIndex,
  totalQuestions,
  players,
  currentPlayerId,
  hasVoted,
  voteCount,
  onVote,
  selectedId,
}: VotingScreenProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  const connectedPlayers = players.filter((p) => p.connectionStatus === "connected");

  return (
    <div className="min-h-screen noise-bg grid-bg flex flex-col px-4 py-8">
      {/* Fixed orb */}
      <div className="fixed top-0 right-0 w-[500px] h-[400px] blur-3xl opacity-6 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, #22d3ee22, transparent)" }} />

      <div className="w-full max-w-2xl mx-auto relative z-10 flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between appear">
          <span className="tag">ROUND {questionIndex + 1}/{totalQuestions}</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple animate-pulse" />
            <span className="text-xs font-display text-text-muted tracking-wider">
              {voteCount}/{connectedPlayers.length} VOTED
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-surface-3 rounded-full overflow-hidden appear appear-delay-1">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7, #22d3ee)" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* Question */}
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 md:p-8 text-center appear appear-delay-2"
        >
          <p className="text-xs font-display tracking-[0.3em] text-purple uppercase mb-4">WHO IS MOST LIKELY TO...</p>
          <h2 className="font-body text-xl md:text-2xl font-semibold text-text-primary leading-relaxed">
            {question}
          </h2>
        </motion.div>

        {/* Player grid */}
        <div className="appear appear-delay-3">
          <p className="text-xs font-display tracking-widest text-text-muted uppercase mb-3 text-center">
            {hasVoted ? "Vote submitted — waiting for others" : "Tap to vote"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence>
              {connectedPlayers.map((player, i) => {
                const isMe = player.id === currentPlayerId;
                const isSelected = selectedId === player.id;

                return (
                  <motion.button
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !hasVoted && !isMe && onVote(player.id)}
                    disabled={hasVoted || isMe}
                    className={`vote-card flex flex-col items-center gap-3 relative
                      ${isSelected ? "voted" : ""}
                      ${isMe ? "opacity-40 cursor-default" : ""}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: `${player.avatar.bodyColor}20`,
                        border: `1px solid ${player.avatar.bodyColor}40`,
                      }}
                    >
                      <AvatarSVG config={player.avatar} size={52} />
                    </div>
                    <div className="text-center">
                      <p className="font-body font-semibold text-text-primary text-sm truncate w-full max-w-[100px]">
                        {player.nickname}
                      </p>
                      {isMe && (
                        <span className="text-xs font-display text-text-muted">(you)</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Waiting indicator */}
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-4 text-center appear"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-purple"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <p className="text-text-secondary text-sm font-display tracking-wider">
                WAITING FOR {connectedPlayers.length - voteCount} MORE VOTE{connectedPlayers.length - voteCount !== 1 ? "S" : ""}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
