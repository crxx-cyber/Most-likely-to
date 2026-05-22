"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HomeScreenProps {
  onCreateRoom: (code?: string) => void;
}

export function HomeScreen({ onCreateRoom }: HomeScreenProps) {
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen noise-bg grid-bg flex flex-col items-center justify-center px-4">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-purple" />
            <span className="font-display text-xs tracking-[0.4em] text-purple uppercase">Party Game</span>
            <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-purple" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-text-primary leading-none">
            MOST
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #a855f7, #22d3ee)" }}
            >
              LIKELY
            </span>
            <br />
            TO
          </h1>
          <p className="text-text-secondary mt-4 text-sm leading-relaxed">
            Vote for your friends. Find out what everyone really thinks.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <AnimatePresence mode="wait">
            {!joining ? (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <button
                  onClick={() => onCreateRoom()}
                  className="btn-primary text-center py-4 text-base"
                >
                  + CREATE ROOM
                </button>
                <button
                  onClick={() => setJoining(true)}
                  className="btn-secondary text-center py-4 text-base"
                >
                  JOIN ROOM
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="join"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass rounded-xl p-5 text-left"
              >
                <p className="text-xs font-display tracking-widest text-text-muted uppercase mb-3">
                  Enter Room Code
                </p>
                <input
                  className="input-field font-display text-2xl tracking-[0.3em] text-center uppercase mb-3"
                  placeholder="ABC123"
                  value={code}
                  onChange={(e) => setCode(e.target.value.slice(0, 6).toUpperCase())}
                  maxLength={6}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setJoining(false)}
                    className="btn-ghost flex-1 text-center"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => code.length === 6 && onCreateRoom(code)}
                    disabled={code.length !== 6}
                    className={`btn-primary flex-[2] text-center ${code.length !== 6 ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    JOIN →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-text-muted text-xs mt-8 font-display tracking-wider"
        >
          2–10 PLAYERS · REAL-TIME · NO DOWNLOAD
        </motion.p>
      </div>
    </div>
  );
}
