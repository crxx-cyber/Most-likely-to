"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { HomeScreen } from "@/components/game/HomeScreen";
import { CharacterLab } from "@/components/avatar/CharacterLab";
import { Lobby } from "@/components/game/Lobby";
import { VotingScreen } from "@/components/game/VotingScreen";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import { FinishedScreen } from "@/components/game/FinishedScreen";
import { DEFAULT_AVATAR } from "@/lib/avatar";
import { AvatarConfig } from "@/types";

export default function Home() {
  const { state, error, pendingCode, selectedVoteId, goToAvatar, confirmAvatar, startGame, submitVote, nextQuestion, reset } = useGame();
  const [nickname, setNickname] = useState("");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);

  const handleConfirmAvatar = (config: AvatarConfig) => {
    setAvatarConfig(config);
    confirmAvatar(nickname, config);
  };

  return (
    <main className="relative">
      {/* Global error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass rounded-xl px-5 py-3 border border-rose-500/40 bg-rose-500/10 shadow-lg"
          >
            <p className="text-rose-400 font-display text-sm tracking-wide">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state.phase === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <HomeScreen onCreateRoom={(code) => goToAvatar(code)} />
          </motion.div>
        )}

        {state.phase === "avatar" && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen noise-bg grid-bg flex items-center justify-center px-4 py-12"
          >
            <div className="w-full max-w-2xl">
              <button onClick={reset} className="btn-ghost mb-6 flex items-center gap-2 text-xs font-display tracking-widest">
                ← BACK
              </button>
              <CharacterLab
                initialConfig={avatarConfig}
                nickname={nickname}
                onNicknameChange={setNickname}
                onConfirm={handleConfirmAvatar}
              />
              {pendingCode && (
                <p className="text-center text-xs text-text-muted mt-4 font-display tracking-wider">
                  Joining room: <span className="text-purple">{pendingCode}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}

        {state.phase === "lobby" && state.room && state.currentPlayer && (
          <motion.div key="lobby" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Lobby
              roomCode={state.room.code}
              players={state.room.players}
              currentPlayerId={state.currentPlayer.id}
              isHost={state.currentPlayer.isHost}
              onStartGame={startGame}
            />
          </motion.div>
        )}

        {state.phase === "voting" && state.room && state.currentPlayer && (
          <motion.div key="voting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VotingScreen
              question={state.currentQuestion}
              questionIndex={state.questionIndex}
              totalQuestions={state.totalQuestions}
              players={state.room.players}
              currentPlayerId={state.currentPlayer.id}
              hasVoted={state.hasVoted}
              voteCount={state.voteCount}
              onVote={submitVote}
              selectedId={selectedVoteId}
            />
          </motion.div>
        )}

        {state.phase === "results" && state.room && state.currentPlayer && state.roundResults && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ResultsScreen
              question={state.currentQuestion}
              tally={state.roundResults.tally}
              winner={state.roundResults.winner}
              players={state.room.players}
              isHost={state.currentPlayer.isHost}
              questionIndex={state.questionIndex}
              totalQuestions={state.totalQuestions}
              onNext={nextQuestion}
            />
          </motion.div>
        )}

        {state.phase === "finished" && (
          <motion.div key="finished" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FinishedScreen leaderboard={state.leaderboard} onPlayAgain={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
