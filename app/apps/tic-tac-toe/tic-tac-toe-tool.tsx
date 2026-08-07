"use client";

import { Circle, RotateCcw, Undo2, X as XIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

import {
  type Board,
  chooseMove,
  type Difficulty,
  evaluateBoard,
  type Player,
} from "./game";

type Mode = "human" | "computer";

const EMPTY: Board = Array(9).fill(null);

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "impossible", label: "Impossible" },
];

export function TicTacToeTool() {
  const [history, setHistory] = React.useState<Board[]>([EMPTY]);
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState<Mode>("computer");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("medium");
  const [score, setScore] = React.useState({ X: 0, O: 0, draws: 0 });
  // Guards against double-counting when the same terminal board re-renders.
  const scoredAt = React.useRef<number | null>(null);

  const board = history[step]!;
  const outcome = evaluateBoard(board);
  const xIsNext = step % 2 === 0;
  const currentPlayer: Player = xIsNext ? "X" : "O";
  const gameOver = Boolean(outcome.winner) || outcome.isDraw;
  const computerTurn = mode === "computer" && !xIsNext && !gameOver;

  const play = React.useCallback(
    (index: number) => {
      const current = history[step]!;
      if (current[index] || evaluateBoard(current).winner) return;

      const next = [...current];
      next[index] = step % 2 === 0 ? "X" : "O";

      setHistory((previous) => [...previous.slice(0, step + 1), next]);
      setStep(step + 1);
    },
    [history, step]
  );

  // The computer moves after a short beat so its turn is visible.
  React.useEffect(() => {
    if (!computerTurn) return;
    const timer = setTimeout(() => {
      const move = chooseMove(board, "O", difficulty);
      if (move !== null) play(move);
    }, 420);
    return () => clearTimeout(timer);
  }, [computerTurn, board, difficulty, play]);

  React.useEffect(() => {
    if (!gameOver) {
      scoredAt.current = null;
      return;
    }
    if (scoredAt.current === step) return;
    scoredAt.current = step;

    setScore((previous) =>
      outcome.winner
        ? { ...previous, [outcome.winner]: previous[outcome.winner] + 1 }
        : { ...previous, draws: previous.draws + 1 }
    );
  }, [gameOver, outcome.winner, step]);

  const newGame = () => {
    setHistory([EMPTY]);
    setStep(0);
    scoredAt.current = null;
  };

  const undo = () => {
    // In computer mode, step back past the computer's reply too.
    const back = mode === "computer" && step >= 2 ? 2 : 1;
    setStep(Math.max(0, step - back));
  };

  const status = outcome.winner
    ? mode === "computer"
      ? outcome.winner === "X"
        ? "You win!"
        : "Computer wins"
      : `${outcome.winner} wins`
    : outcome.isDraw
      ? "It's a draw"
      : mode === "computer"
        ? xIsNext
          ? "Your turn"
          : "Computer thinking…"
        : `${currentPlayer} to play`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,20rem)] lg:items-start">
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8 sm:py-10">
          <p
            className={cn(
              "text-lg font-semibold",
              outcome.winner && "text-primary",
              outcome.isDraw && "text-muted-foreground"
            )}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>

          <div
            role="group"
            aria-label="Tic-tac-toe board"
            className="bg-border grid grid-cols-3 gap-1.5 rounded-xl p-1.5"
          >
            {board.map((cell, index) => {
              const isWinning = outcome.line?.includes(index) ?? false;
              const disabled = Boolean(cell) || gameOver || computerTurn;

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={
                    cell
                      ? `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${cell}`
                      : `Play row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}`
                  }
                  disabled={disabled}
                  onClick={() => play(index)}
                  className={cn(
                    "bg-card grid size-20 place-items-center rounded-lg transition-all duration-200 sm:size-28",
                    "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                    !disabled && "hover:bg-accent cursor-pointer",
                    isWinning && "bg-success/15",
                    disabled && !cell && "cursor-not-allowed"
                  )}
                >
                  {cell === "X" ? (
                    <XIcon
                      strokeWidth={2.5}
                      className={cn(
                        "animate-pop size-10 sm:size-14",
                        isWinning ? "text-success" : "text-primary"
                      )}
                    />
                  ) : cell === "O" ? (
                    <Circle
                      strokeWidth={2.5}
                      className={cn(
                        "animate-pop size-9 sm:size-12",
                        isWinning ? "text-success" : "text-foreground/70"
                      )}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={newGame}>
              <RotateCcw className="size-4" aria-hidden />
              New game
            </Button>
            <Button
              variant="outline"
              onClick={undo}
              disabled={step === 0 || computerTurn}
            >
              <Undo2 className="size-4" aria-hidden />
              Undo
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 lg:sticky lg:top-24">
        <Card>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mode">Opponent</Label>
              <ToggleGroup
                id="mode"
                type="single"
                value={mode}
                onValueChange={(value) => {
                  if (!value) return;
                  setMode(value as Mode);
                  newGame();
                }}
                className="w-full"
              >
                <ToggleGroupItem value="computer" className="flex-1">
                  Computer
                </ToggleGroupItem>
                <ToggleGroupItem value="human" className="flex-1">
                  Two players
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {mode === "computer" ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => {
                    setDifficulty(value as Difficulty);
                    newGame();
                  }}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {difficulty === "impossible" ? (
                  <p className="text-muted-foreground text-xs">
                    Plays perfectly — a draw is the best you can do.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-2 border-t pt-5">
              <h2 className="text-sm font-semibold">Score</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <ScoreTile
                  label={mode === "computer" ? "You" : "X"}
                  value={score.X}
                />
                <ScoreTile label="Draws" value={score.draws} muted />
                <ScoreTile
                  label={mode === "computer" ? "Computer" : "O"}
                  value={score.O}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScore({ X: 0, O: 0, draws: 0 })}
                disabled={score.X + score.O + score.draws === 0}
              >
                Reset score
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Move history</h2>
            <ol className="flex flex-wrap gap-1.5">
              {history.map((_, move) => (
                <li key={move}>
                  <Button
                    variant={move === step ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStep(move)}
                    className="min-w-9 tabular-nums"
                    aria-label={
                      move === 0 ? "Go to game start" : `Go to move ${move}`
                    }
                    aria-current={move === step ? "step" : undefined}
                  >
                    {move === 0 ? "Start" : move}
                  </Button>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScoreTile({
  label,
  value,
  muted,
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className="bg-muted/50 flex flex-col gap-0.5 rounded-lg px-2 py-3">
      <span
        className={cn(
          "text-2xl font-semibold tabular-nums",
          muted && "text-muted-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-muted-foreground truncate text-xs">{label}</span>
    </div>
  );
}
