# Most Likely To — Real-Time Multiplayer Party Game

A full-stack real-time multiplayer web app built with Next.js 14, Socket.io, Tailwind CSS, Framer Motion, and Prisma.

---

## Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and set `DATABASE_URL` to your PostgreSQL connection string.

> **No PostgreSQL?** The game works fully without a database in development — game state is stored in-memory on the server. You only need PostgreSQL for persistent game history (optional).

### 3. (Optional) Set up the database
```bash
npm run db:generate   # generates Prisma client
npm run db:push       # pushes schema to your database
```

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Play
1. One person clicks **Create Room** — they become the host
2. Share the 6-character room code with friends
3. Everyone clicks **Join Room**, enters the code, and builds their avatar
4. The host clicks **Start Game**
5. Each round, a question appears — everyone votes for the person who best fits it
6. Results show after all votes are in — the host advances to the next round
7. After 10 questions, the final leaderboard is revealed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Real-Time | Socket.io (custom Node server) |
| Database | PostgreSQL via Prisma (optional) |
| Fonts | Space Mono + DM Sans |

---

## Project Structure

```
most-likely-to/
├── server.js              # Custom Node.js server with Socket.io
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout + fonts
│   │   ├── page.tsx       # Main page / game controller
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── avatar/
│   │   │   ├── AvatarSVG.tsx      # SVG avatar renderer
│   │   │   └── CharacterLab.tsx   # Avatar customizer
│   │   └── game/
│   │       ├── HomeScreen.tsx     # Landing page
│   │       ├── Lobby.tsx          # Waiting room
│   │       ├── VotingScreen.tsx   # Active voting phase
│   │       ├── ResultsScreen.tsx  # Round results
│   │       └── FinishedScreen.tsx # Final leaderboard
│   ├── hooks/
│   │   └── useGame.ts     # Socket.io game state hook
│   ├── lib/
│   │   ├── socket.ts      # Socket client singleton
│   │   └── avatar.ts      # Avatar utilities + defaults
│   └── types/
│       └── index.ts       # Shared TypeScript types
```

---

## Deployment (Railway)

1. Push to GitHub
2. Create a new project on [railway.app](https://railway.app)
3. Add a PostgreSQL service
4. Set environment variables:
   - `DATABASE_URL` — from Railway PostgreSQL service
   - `NEXT_PUBLIC_SOCKET_URL` — your Railway app URL
5. Deploy — Railway auto-detects Node.js and runs `npm run build` then `npm start`

## Deployment (Vercel)

> Note: Vercel serverless functions don't support persistent WebSocket connections. For Vercel, replace Socket.io with [Supabase Realtime](https://supabase.com/docs/guides/realtime) or [Pusher](https://pusher.com/).

---

## Customization

### Add more questions
Edit the `QUESTIONS` array in `server.js`.

### Change avatar colors
Edit `BODY_COLORS` and `ACCENT_COLORS` in `src/lib/avatar.ts`.

### Change number of rounds
The server randomly selects 10 questions per game. Change `.slice(0, 10)` in `server.js` to adjust.

### Add categories
Extend the `QUESTIONS` array with objects `{ text, category }` and update the server logic to filter by category.
