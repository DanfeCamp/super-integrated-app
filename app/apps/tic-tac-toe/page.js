"use client";

/**
 * External dependencies.
 */
import React, { useState } from "react";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";
import Board from "./board";

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i],
      };
    }
  }

  return null;
};

const TicTacToe = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/tic-tac-toe", title: "Tic-Tac-Toe" },
  ];

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    const historyCopy = history.slice(0, stepNumber + 1);
    const current = historyCopy[stepNumber];
    const squares = current.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? "X" : "O";
    setHistory([...historyCopy, squares]);
    setStepNumber(historyCopy.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current);

  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Tic-Tac-Toe */}
        <div className="flex flex-col items-center">
          <div className="grid lg:grid-cols-2 justify-center gap-8 w-full">
            <Board
              squares={current}
              winningLines={winner ? winner.lines : null}
              onClick={(i) => handleClick(i)}
            />
            <div className="p-4 border rounded-md shadow-sm">
              <div className="w-full border-b flex justify-between items-center mb-1 pb-2 ">
                <div className="text-xl font-medium">{status}</div>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  onClick={() => {
                    setHistory([Array(9).fill(null)]);
                    setStepNumber(0);
                    setXIsNext(true);
                  }}
                >
                  Reset
                </button>
              </div>
              <div className="overflow-y-scroll sia-scrollbar sia-scrollbar-light">
                {history.map((step, move) => {
                  const desc = move
                    ? "Go to move #" + move
                    : "Go to game start";
                  return (
                    <button
                      key={move}
                      onClick={() => jumpTo(move)}
                      className="block my-1 text-blue-500 hover:underline"
                    >
                      {desc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can start the game by clicking any of the squares on the
              board.
            </li>
            <li className="ml-4">
              Users can alternate turns between "<code>X</code>" and "
              <code>O</code>" by clicking on empty squares
            </li>
            <li className="ml-4">
              Users can see the game status, showing whose turn it is or if
              there is a winner.
            </li>
            <li className="ml-4">
              Users can click on the "<code>Reset</code>" button to reset the
              game or click on the "<code>Go to game start</code>" to return to
              the initial state of game.
            </li>
            <li className="ml-4">
              User can navigate to any previous move by clicking the respective
              "<code>Go to move #</code>" button.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default TicTacToe;
