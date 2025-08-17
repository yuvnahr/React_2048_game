import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  SIZE,
  emptyBoard,
  cloneBoard,
  getEmptyCells,
  addRandomTile,
  compressAndMergeRowLeft,
  flip,
  rotateCW,
  rotateCCW,
  moveLeft,
  move,
  hasMoves,
  highestTile,
} from "./game.js";

// Returns appropriate Tailwind CSS classes based on tile value for styling
const valueClass = (v) => {
  const map = {
    0: "bg-neutral-800/30 text-transparent",
    2: "bg-amber-200 text-neutral-800",
    4: "bg-amber-300 text-neutral-800",
    8: "bg-orange-400 text-white",
    16: "bg-orange-500 text-white",
    32: "bg-orange-600 text-white",
    64: "bg-orange-700 text-white",
    128: "bg-yellow-400 text-neutral-900",
    256: "bg-yellow-500 text-neutral-900",
    512: "bg-yellow-600 text-neutral-900",
    1024: "bg-lime-400 text-neutral-900",
    2048: "bg-lime-500 text-neutral-900",
    4096: "bg-emerald-500 text-white",
    8192: "bg-emerald-600 text-white",
  };
  // If tile value exceeds predefined range, use strongest emerald style, else neutral text-white
  return map[v] || (v > 8192 ? "bg-emerald-700 text-white" : "bg-neutral-700 text-white");
};

// Determines tile text size based on the value magnitude for optimal readability
const tileTextSize = (v) => {
  if (v < 100) return "text-4xl md:text-5xl";
  if (v < 1000) return "text-3xl md:text-4xl";
  if (v < 10000) return "text-2xl md:text-3xl";
  return "text-xl md:text-2xl";
};

export default function App() {
  // Game board state, initialized with two random tiles added
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(emptyBoard())));
  // Current score state
  const [score, setScore] = useState(0);
  // Best score state, persisted in localStorage
  const [best, setBest] = useState(() => {
    const s = localStorage.getItem("best-2048");
    return s ? Number(s) : 0;
  });
  // Flags for game won or lost state
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  // Undo availability flag and snapshot of previous state for undo functionality
  const [canUndo, setCanUndo] = useState(false);
  const prevRef = useRef(null);
  // Track touch start coordinates for swipe handling on mobile
  const touchStart = useRef(null);

  // Set up keyboard event listeners for game control (arrow keys, WASD, 'U' for undo)
  useEffect(() => {
    const onKey = (e) => {
      let dir = null;
      const k = e.key.toLowerCase();
      if (e.key === "ArrowLeft" || k === "a") dir = "left";
      else if (e.key === "ArrowRight" || k === "d") dir = "right";
      else if (e.key === "ArrowUp" || k === "w") dir = "up";
      else if (e.key === "ArrowDown" || k === "s") dir = "down";
      else if (k === "u") {
        undo();
        return;
      }
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [board, score, won, lost]);

  // Update best score in localStorage whenever score changes
  useEffect(() => {
    setBest((b) => {
      const next = Math.max(b, score);
      localStorage.setItem("best-2048", String(next));
      return next;
    });
  }, [score]);

  // Check for game win or loss after board updates
  useEffect(() => {
    if (!won && highestTile(board) >= 2048) setWon(true);
    if (!hasMoves(board)) setLost(true);
  }, [board, won]);

  // Process a move in the given direction; update board and score if move valid
  function handleMove(dir) {
    if (won || lost) return; // Do nothing if game is over or won
    const snapshot = { board: cloneBoard(board), score };
    const { board: movedBoard, score: gained, moved } = move(board, dir);
    if (!moved) return; // Ignore if move does not change board
    // Add a new random tile after a valid move
    const withNew = addRandomTile(movedBoard);
    prevRef.current = snapshot; // Store previous state for undo support
    setCanUndo(true);
    setBoard(withNew);
    setScore((s) => s + gained);
  }

  // Reset the game to initial state with two random tiles
  function newGame() {
    setBoard(addRandomTile(addRandomTile(emptyBoard())));
    setScore(0);
    setWon(false);
    setLost(false);
    setCanUndo(false);
    prevRef.current = null;
  }

  // Undo last move (allowed once per move)
  function undo() {
    if (prevRef.current && canUndo) {
      setBoard(prevRef.current.board);
      setScore(prevRef.current.score);
      setCanUndo(false);
      prevRef.current = null;
    }
  }

  // Capture the starting position of a touch event (for mobile swipe support)
  function onTouchStart(e) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  // Handle end of a touch event to determine swipe direction and trigger moves
  function onTouchEnd(e) {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absx = Math.abs(dx),
      absy = Math.abs(dy);
    const threshold = 24; // Minimum swipe distance to trigger move
    if (Math.max(absx, absy) < threshold) return; // Ignore small taps
    if (absx > absy) handleMove(dx > 0 ? "right" : "left");
    else handleMove(dy > 0 ? "down" : "up");
    touchStart.current = null;
  }

  // Render the game UI
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[520px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">2048</h1>
            <p className="text-neutral-400 text-sm md:text-base">by yuv</p>
          </div>
          <div className="flex gap-2">
            <ScoreCard label="SCORE" value={score.toLocaleString()} />
            <ScoreCard label="BEST" value={best.toLocaleString()} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={newGame}
            className="px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 transition shadow"
          >
            New Game
          </button>
          <button
            onClick={undo}
            disabled={!canUndo}
            className="px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 transition shadow"
          >
            Undo (U)
          </button>
          <div className="ml-auto text-xs md:text-sm text-neutral-400 hidden sm:block">
            Use arrow keys / WASD or swipe
          </div>
        </div>

        {/* Board */}
        <div
          className="relative aspect-square rounded-3xl p-2 bg-neutral-900 shadow-inner select-none touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Grid background (fixed 4x4 classes so Tailwind generates them) */}
          <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full">
            {Array.from({ length: SIZE * SIZE }, (_, i) => (
              <div key={`bg-${i}`} className="rounded-2xl bg-neutral-800/50" />
            ))}
          </div>

          {/* Tiles layer */}
          <div className="grid grid-cols-4 grid-rows-4 gap-2 h-full absolute inset-2">
            {board.map((row, r) =>
              row.map((val, c) => <Tile key={`${r}-${c}-${val}-${Math.random()}`} value={val} />)
            )}
          </div>

          {/* Overlays for won/lost */}
          <AnimatePresence>
            {won && <Overlay key="won" title="You win!" subtitle="Press New Game to continue" />}
            {lost && <Overlay key="lost" title="Game over" subtitle="No moves left" />}
          </AnimatePresence>
        </div>

        {/* Footer tip */}
        <div className="mt-3 text-neutral-400 text-xs md:text-sm">
          <p>Tip: chain merges are scored additively per move; best score is saved locally.</p>
        </div>
      </div>
    </div>
  );
}

// Small card component to display score labels and values
function ScoreCard({ label, value }) {
  return (
    <div className="bg-neutral-900 rounded-2xl px-3 py-2 min-w-[88px] text-center shadow">
      <div className="text-[10px] tracking-widest text-neutral-400">{label}</div>
      <div className="font-bold text-lg">{value}</div>
    </div>
  );
}

// Animated tile component displaying a tile's value, color, and size based on value
function Tile({ value }) {
  return (
    <motion.div
      initial={{ scale: value ? 0.8 : 1, opacity: value ? 0 : 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`rounded-2xl flex items-center justify-center font-extrabold ${valueClass(
        value
      )} ${tileTextSize(value)} shadow`}
    >
      {value !== 0 ? value : ""}
    </motion.div>
  );
}

// Overlay displayed when game is won or lost with title and subtitle
function Overlay({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-center p-6"
    >
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-2">
        <div className="text-3xl md:text-4xl font-extrabold">{title}</div>
        <div className="text-neutral-300">{subtitle}</div>
      </motion.div>
    </motion.div>
  );
}
