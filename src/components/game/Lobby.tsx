"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/types";
import { AvatarSVG } from "../avatar/AvatarSVG";

interface LobbyProps {
  roomCode: string;
  players: Player[];
  currentPlayerId: string;
  isHost: boolean;
  onStartGame: () => void;
}

export function Lobby({ roomCode, players, currentPlayerId, isHost, onStartGame }: LobbyProps) {
  const canStart = players.length >= 2;

  return (
    <div className="min-h-screen noise-bg grid-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #a855f7, transparent)" }} />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8 appear">
          <span className="tag">LOBBY</span>
          <h2 className="font-display text-4xl font-bold mt-3 text-text-primary">Waiting Room</h2>

          {/* Room Code */}
          <div className="glass rounded-xl p-4 mt-5 inline-block">
            <p className="text-xs font-display tracking-[0.3em] text-text-muted uppercase mb-1">Room Code</p>
            <p className="font-display text-4xl font-bold tracking-[0.3em] text-purple">{roomCode}</p>
            <p className="text-xs text-text-muted mt-1">Share this with friends</p>
          </div>
        </div>

        {/* Players */}
        <div className="glass rounded-2xl p-5 mb-5 appear appear-delay-1">
          <div className="flex items-center justify-between mb-4">
            <p className="font-display text-xs tracking-widest text-text-secondary uppercase">Players</p>
            <span className="tag">{players.length}/10</span>
          </div>

          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    player.id === currentPlayerId
                      ? "bg-purple/10 border border-purple/30"
                      : "bg-surface-3/50 border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: `${player.avatar.bodyColor}20`, border: `1px solid ${player.avatar.bodyColor}40` }}>
                    <AvatarSVG config={player.avatar} size={36} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-text-primary truncate">{player.nickname}</p>
                    <div className="flex items-center gap-2">
                      {player.isHost && (
                        <span className="text-xs font-display tracking-wider text-yellow-400">HOST</span>
                      )}
                      {player.id === currentPlayerId && (
                        <span className="text-xs font-display tracking-wider text-purple">YOU</span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      player.connectionStatus === "connected" ? "bg-green-neon" : "bg-text-muted"
                    }`}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 2 - players.length) }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border">
                <div className="w-10 h-10 rounded-full border border-dashed border-border" />
                <p className="text-text-muted text-sm">Waiting for player...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="appear appear-delay-2">
          {isHost ? (
            <div>
              {!canStart && (
                <p className="text-text-muted text-sm text-center mb-3 font-display tracking-wide">
                  Need at least 2 players to start
                </p>
              )}
              <button
                onClick={onStartGame}
                disabled={!canStart}
                className={`btn-primary w-full py-4 text-base ${!canStart ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                START GAME ({players.length} players)
              </button>
            </div>
          ) : (
            <div className="glass rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-text-secondary">
                <div className="w-2 h-2 rounded-full bg-purple animate-pulse" />
                <p className="font-display text-xs tracking-widest uppercase">Waiting for host to start...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
