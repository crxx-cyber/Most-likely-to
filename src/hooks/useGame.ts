"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";
import { GameState, AvatarConfig, Player } from "@/types";
import { DEFAULT_AVATAR } from "@/lib/avatar";

const INITIAL_STATE: GameState = {
  room: null,
  currentPlayer: null,
  phase: "home",
  currentQuestion: "",
  questionIndex: 0,
  totalQuestions: 10,
  roundResults: null,
  voteCount: 0,
  leaderboard: [],
  hasVoted: false,
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const socketRef = useRef(getSocket());

  const updateState = useCallback((updates: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("player_joined", ({ players }: { player: Player; players: Player[] }) => {
      setState((prev) => ({
        ...prev,
        room: prev.room ? { ...prev.room, players } : prev.room,
      }));
    });

    socket.on("player_left", ({ players }: { playerId: string; players: Player[] }) => {
      setState((prev) => ({
        ...prev,
        room: prev.room ? { ...prev.room, players } : prev.room,
      }));
    });

    socket.on("game_started", ({ question, questionIndex, totalQuestions, players }: {
      question: string; questionIndex: number; totalQuestions: number; players: Player[];
    }) => {
      setState((prev) => ({
        ...prev,
        phase: "voting",
        currentQuestion: question,
        questionIndex,
        totalQuestions,
        hasVoted: false,
        voteCount: 0,
        roundResults: null,
        room: prev.room ? { ...prev.room, players, status: "active" } : prev.room,
      }));
      setSelectedVoteId(null);
    });

    socket.on("vote_update", ({ voteCount, totalPlayers }: { voteCount: number; totalPlayers: number }) => {
      setState((prev) => ({ ...prev, voteCount }));
    });

    socket.on("round_results", ({ tally, winner, players, questionIndex }: {
      tally: Record<string, number>; winner: Player; players: Player[]; questionIndex: number;
    }) => {
      setState((prev) => ({
        ...prev,
        phase: "results",
        roundResults: { tally, winner },
        room: prev.room ? { ...prev.room, players } : prev.room,
      }));
    });

    socket.on("next_question", ({ question, questionIndex, totalQuestions, players }: {
      question: string; questionIndex: number; totalQuestions: number; players: Player[];
    }) => {
      setState((prev) => ({
        ...prev,
        phase: "voting",
        currentQuestion: question,
        questionIndex,
        totalQuestions,
        hasVoted: false,
        voteCount: 0,
        roundResults: null,
        room: prev.room ? { ...prev.room, players } : prev.room,
      }));
      setSelectedVoteId(null);
    });

    socket.on("game_finished", ({ leaderboard }: { leaderboard: Player[] }) => {
      setState((prev) => ({ ...prev, phase: "finished", leaderboard }));
    });

    socket.on("error", ({ message }: { message: string }) => {
      setError(message);
      setTimeout(() => setError(null), 4000);
    });

    return () => {
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("game_started");
      socket.off("vote_update");
      socket.off("round_results");
      socket.off("next_question");
      socket.off("game_finished");
      socket.off("error");
    };
  }, []);

  const goToAvatar = useCallback((code?: string) => {
    if (code) setPendingCode(code);
    updateState({ phase: "avatar" });
  }, [updateState]);

  const createRoom = useCallback((nickname: string, avatar: AvatarConfig) => {
    socketRef.current.emit("create_room", { nickname, avatar }, (res: {
      success: boolean; code?: string; player?: Player; room?: any; error?: string;
    }) => {
      if (!res.success) { setError(res.error || "Failed to create room"); return; }
      setState((prev) => ({
        ...prev,
        phase: "lobby",
        room: res.room,
        currentPlayer: res.player || null,
      }));
    });
  }, []);

  const joinRoom = useCallback((nickname: string, avatar: AvatarConfig, code: string) => {
    socketRef.current.emit("join_room", { nickname, avatar, code }, (res: {
      success: boolean; code?: string; player?: Player; room?: any; error?: string;
    }) => {
      if (!res.success) { setError(res.error || "Failed to join room"); return; }
      setState((prev) => ({
        ...prev,
        phase: "lobby",
        room: res.room,
        currentPlayer: res.player || null,
      }));
    });
  }, []);

  const confirmAvatar = useCallback((nickname: string, avatar: AvatarConfig) => {
    if (pendingCode) {
      joinRoom(nickname, avatar, pendingCode);
      setPendingCode(null);
    } else {
      createRoom(nickname, avatar);
    }
  }, [pendingCode, joinRoom, createRoom]);

  const startGame = useCallback(() => {
    socketRef.current.emit("start_game");
  }, []);

  const submitVote = useCallback((targetId: string) => {
    setSelectedVoteId(targetId);
    setState((prev) => ({ ...prev, hasVoted: true }));
    socketRef.current.emit("submit_vote", { targetId });
  }, []);

  const nextQuestion = useCallback(() => {
    socketRef.current.emit("next_question");
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setPendingCode(null);
    setSelectedVoteId(null);
  }, []);

  return {
    state,
    error,
    pendingCode,
    selectedVoteId,
    goToAvatar,
    confirmAvatar,
    startGame,
    submitVote,
    nextQuestion,
    reset,
  };
}
