export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export interface Outcome {
  winner: Player | null;
  line: readonly number[] | null;
  isDraw: boolean;
}

export function evaluateBoard(board: Board): Outcome {
  for (const line of LINES) {
    const [a, b, c] = line;
    const value = board[a];
    if (value && value === board[b] && value === board[c]) {
      return { winner: value, line, isDraw: false };
    }
  }

  return {
    winner: null,
    line: null,
    isDraw: board.every((cell) => cell !== null),
  };
}

export function emptyCells(board: Board) {
  return board.reduce<number[]>(
    (indices, cell, index) => (cell === null ? [...indices, index] : indices),
    []
  );
}

/**
 * Minimax with depth-aware scoring, so the computer prefers winning sooner and
 * losing later. The 9-cell search space is small enough that no pruning or
 * memoisation is needed.
 */
function minimax(
  board: Board,
  player: Player,
  computer: Player,
  depth: number
): number {
  const { winner, isDraw } = evaluateBoard(board);
  if (winner === computer) return 10 - depth;
  if (winner) return depth - 10;
  if (isDraw) return 0;

  const scores = emptyCells(board).map((index) => {
    const next = [...board];
    next[index] = player;
    return minimax(next, player === "X" ? "O" : "X", computer, depth + 1);
  });

  return player === computer ? Math.max(...scores) : Math.min(...scores);
}

export type Difficulty = "easy" | "medium" | "impossible";

/**
 * Picks the computer's move.
 *
 * `easy` plays randomly, `medium` plays optimally 65% of the time (beatable but
 * not a pushover) and `impossible` always plays optimally — the best a human
 * can manage is a draw.
 */
export function chooseMove(
  board: Board,
  computer: Player,
  difficulty: Difficulty
): number | null {
  const available = emptyCells(board);
  if (available.length === 0) return null;

  const random = () => available[Math.floor(Math.random() * available.length)]!;

  if (difficulty === "easy") return random();
  if (difficulty === "medium" && Math.random() > 0.65) return random();

  let bestScore = Number.NEGATIVE_INFINITY;
  let bestMove = available[0]!;

  for (const index of available) {
    const next = [...board];
    next[index] = computer;
    const score = minimax(next, computer === "X" ? "O" : "X", computer, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}
