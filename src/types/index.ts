export interface AvatarConfig {
  bodyShape: "round" | "square" | "blob";
  bodyColor: string;
  eyeStyle: "normal" | "happy" | "sleepy" | "surprised" | "cool";
  mouthStyle: "smile" | "grin" | "neutral" | "open" | "smirk";
  accessory: "none" | "hat" | "glasses" | "crown" | "headphones";
  accentColor: string;
}

export interface Player {
  id: string;
  nickname: string;
  avatar: AvatarConfig;
  isHost: boolean;
  score: number;
  connectionStatus: "connected" | "disconnected";
}

export interface Room {
  code: string;
  hostId: string;
  status: "lobby" | "active" | "finished";
  players: Player[];
  currentQuestionIndex: number;
  questions: string[];
  roundVotes: Record<number, Record<string, string>>;
}

export interface GameState {
  room: Room | null;
  currentPlayer: Player | null;
  phase: "home" | "avatar" | "lobby" | "question" | "voting" | "results" | "finished";
  currentQuestion: string;
  questionIndex: number;
  totalQuestions: number;
  roundResults: {
    tally: Record<string, number>;
    winner: Player | null;
  } | null;
  voteCount: number;
  leaderboard: Player[];
  hasVoted: boolean;
}
