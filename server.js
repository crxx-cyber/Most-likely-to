const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory game state (replace with Redis/DB for production scale)
const rooms = new Map();

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const QUESTIONS = [
  "Who is most likely to accidentally start a fire while cooking?",
  "Who is most likely to become a billionaire and then forget where they put their money?",
  "Who is most likely to survive a zombie apocalypse for the longest?",
  "Who is most likely to get arrested for something completely ridiculous?",
  "Who is most likely to join a cult by accident?",
  "Who is most likely to talk to their pets as if they were humans?",
  "Who is most likely to sleep through a major earthquake?",
  "Who is most likely to try to use a fake ID at age 50?",
  "Who is most likely to win a reality TV show for all the wrong reasons?",
  "Who is most likely to go to the grocery store for milk and come back with a new pet?",
  "Who is most likely to be a secret agent in real life?",
  "Who is most likely to accidentally reply-all to a company-wide email with a private rant?",
  "Who is most likely to spend all their savings on a get rich quick scheme?",
  "Who is most likely to forget their own birthday?",
  "Who is most likely to become a famous meme?",
];

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Create room
    socket.on("create_room", ({ nickname, avatar }, callback) => {
      const code = generateCode();
      const player = {
        id: socket.id,
        nickname,
        avatar,
        isHost: true,
        score: 0,
        connectionStatus: "connected",
      };
      const room = {
        code,
        hostId: socket.id,
        status: "lobby",
        players: [player],
        currentQuestionIndex: 0,
        votes: {},
        questions: [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10),
        roundVotes: {},
      };
      rooms.set(code, room);
      socket.join(code);
      socket.data.roomCode = code;
      socket.data.playerId = socket.id;
      callback({ success: true, code, player, room });
    });

    // Join room
    socket.on("join_room", ({ code, nickname, avatar }, callback) => {
      const room = rooms.get(code.toUpperCase());
      if (!room) return callback({ success: false, error: "Room not found" });
      if (room.status !== "lobby") return callback({ success: false, error: "Game already started" });
      if (room.players.length >= 10) return callback({ success: false, error: "Room is full" });

      const player = {
        id: socket.id,
        nickname,
        avatar,
        isHost: false,
        score: 0,
        connectionStatus: "connected",
      };
      room.players.push(player);
      socket.join(code.toUpperCase());
      socket.data.roomCode = code.toUpperCase();
      socket.data.playerId = socket.id;

      io.to(code.toUpperCase()).emit("player_joined", { player, players: room.players });
      callback({ success: true, code: code.toUpperCase(), player, room });
    });

    // Start game
    socket.on("start_game", () => {
      const code = socket.data.roomCode;
      const room = rooms.get(code);
      if (!room || room.hostId !== socket.id) return;
      if (room.players.length < 2) {
        socket.emit("error", { message: "Need at least 2 players" });
        return;
      }
      room.status = "active";
      room.currentQuestionIndex = 0;
      room.roundVotes = {};
      io.to(code).emit("game_started", {
        question: room.questions[0],
        questionIndex: 0,
        totalQuestions: room.questions.length,
        players: room.players,
      });
    });

    // Submit vote
    socket.on("submit_vote", ({ targetId }) => {
      const code = socket.data.roomCode;
      const room = rooms.get(code);
      if (!room || room.status !== "active") return;

      const qi = room.currentQuestionIndex;
      if (!room.roundVotes[qi]) room.roundVotes[qi] = {};
      room.roundVotes[qi][socket.id] = targetId;

      const activePlayers = room.players.filter((p) => p.connectionStatus === "connected");
      const voteCount = Object.keys(room.roundVotes[qi]).length;

      io.to(code).emit("vote_update", {
        voteCount,
        totalPlayers: activePlayers.length,
      });

      // All voted
      if (voteCount >= activePlayers.length) {
        const tally = {};
        Object.values(room.roundVotes[qi]).forEach((tid) => {
          tally[tid] = (tally[tid] || 0) + 1;
        });

        const winnerId = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
        const winner = room.players.find((p) => p.id === winnerId);
        if (winner) winner.score += 1;

        io.to(code).emit("round_results", {
          tally,
          winner,
          players: room.players,
          questionIndex: qi,
        });
      }
    });

    // Next question
    socket.on("next_question", () => {
      const code = socket.data.roomCode;
      const room = rooms.get(code);
      if (!room || room.hostId !== socket.id) return;

      room.currentQuestionIndex += 1;

      if (room.currentQuestionIndex >= room.questions.length) {
        room.status = "finished";
        const sorted = [...room.players].sort((a, b) => b.score - a.score);
        io.to(code).emit("game_finished", { leaderboard: sorted });
      } else {
        room.roundVotes[room.currentQuestionIndex] = {};
        io.to(code).emit("next_question", {
          question: room.questions[room.currentQuestionIndex],
          questionIndex: room.currentQuestionIndex,
          totalQuestions: room.questions.length,
          players: room.players,
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      const code = socket.data.roomCode;
      if (!code) return;
      const room = rooms.get(code);
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (player) player.connectionStatus = "disconnected";

      io.to(code).emit("player_left", { playerId: socket.id, players: room.players });

      // Clean up empty rooms
      const connected = room.players.filter((p) => p.connectionStatus === "connected");
      if (connected.length === 0) {
        setTimeout(() => {
          const r = rooms.get(code);
          if (r && r.players.every((p) => p.connectionStatus === "disconnected")) {
            rooms.delete(code);
          }
        }, 30000);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
