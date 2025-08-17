export const SIZE = 4;

// Creates an empty game board
export const emptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

// Deep copy of board
export const cloneBoard = (b) => b.map((r) => r.slice());

// Collects [row, col] pairs of empty cells on board
export const getEmptyCells = (b) => {
  const out = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (b[r][c] === 0) out.push([r, c]);
  return out;
};

// Adds a random tile (2 or 4) to a random empty cell
export const addRandomTile = (b, rng = Math.random) => {
  const empty = getEmptyCells(b);
  if (empty.length === 0) return b;
  const [r, c] = empty[Math.floor(rng() * empty.length) % empty.length];
  const v = rng() < 0.9 ? 2 : 4;
  const copy = cloneBoard(b);
  copy[r][c] = v;
  return copy;
};

// Checks if two arrays are equal in value
export const arraysEqual = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

// Merge and compress a row left, just like the 2048 game
export function compressAndMergeRowLeft(row) {
  const nonzero = row.filter((x) => x !== 0);
  const merged = [];
  let gained = 0;
  for (let i = 0; i < nonzero.length; i++) {
    if (i < nonzero.length - 1 && nonzero[i] === nonzero[i + 1]) {
      const v = nonzero[i] * 2;
      merged.push(v);
      gained += v;
      i++;
    } else {
      merged.push(nonzero[i]);
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, gained };
}

// Returns flipped board horizontally
export function flip(b) {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      out[r][SIZE - 1 - c] = b[r][c];
  return out;
}

// Clockwise rotation of board
export function rotateCW(b) {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      out[c][SIZE - 1 - r] = b[r][c];
  return out;
}

// Counter-clockwise rotation of board
export function rotateCCW(b) {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      out[SIZE - 1 - c][r] = b[r][c];
  return out;
}

// Processes a left move for the board, returns new board, score, and moved flag
export function moveLeft(b) {
  const out = emptyBoard();
  let moved = false;
  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    const { row, gained } = compressAndMergeRowLeft(b[r]);
    out[r] = row;
    score += gained;
    if (!arraysEqual(row, b[r])) moved = true;
  }
  return { board: out, score, moved };
}

// Moves the board based on the direction
export function move(b, dir) {
  switch (dir) {
    case "left":
      return moveLeft(b);
    case "right": {
      const res = moveLeft(flip(b));
      return { board: flip(res.board), score: res.score, moved: res.moved };
    }
    case "up": {
      const res = moveLeft(rotateCCW(b));
      return { board: rotateCW(res.board), score: res.score, moved: res.moved };
    }
    case "down": {
      const res = moveLeft(rotateCW(b));
      return { board: rotateCCW(res.board), score: res.score, moved: res.moved };
    }
    default:
      return { board: b, score: 0, moved: false };
  }
}

// Checks if any moves are possible (not lost)
export function hasMoves(b) {
  if (getEmptyCells(b).length > 0) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = b[r][c];
      if (r + 1 < SIZE && b[r + 1][c] === v) return true;
      if (c + 1 < SIZE && b[r][c + 1] === v) return true;
    }
  }
  return false;
}

// Returns value of highest tile on the board
export const highestTile = (b) => Math.max(...b.flat());
