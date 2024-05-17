/**
 * External dependencies.
 */
import React from "react";

const Square = ({ value, onClick, extraclasses }) => {
  return (
    <button
      className={`w-20 h-20 md:w-32 md:h-32 border border-gray-400 rounded-xl flex items-center justify-center text-2xl sm:text-4xl text-gray-800 cursor-pointer hover:bg-gray-200 ${extraclasses}`}
      onClick={onClick}
    >
      <span
        className={`transition transform duration-200 ${
          value ? "scale-150" : "scale-0"
        }`}
      >
        {value}
      </span>
    </button>
  );
};

const Board = ({ squares, winningLines, onClick }) => {
  const renderSquare = (i, extraclasses) => {
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
        extraclasses={extraclasses}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-8 border rounded-md items-center">
      <div className="flex gap-4">
        {renderSquare(
          0,
          winningLines && winningLines.includes(0)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
        {renderSquare(
          1,
          winningLines && winningLines.includes(1)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
        {renderSquare(
          2,
          winningLines && winningLines.includes(2)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
      </div>
      <div className="flex gap-4">
        {renderSquare(
          3,
          winningLines && winningLines.includes(3)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
        {renderSquare(
          4,
          winningLines && winningLines.includes(4)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
        {renderSquare(
          5,
          winningLines && winningLines.includes(5)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
      </div>
      <div className="flex gap-4">
        {renderSquare(
          6,
          winningLines && winningLines.includes(6)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
        {renderSquare(
          7,
          winningLines && winningLines.includes(7)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
        {renderSquare(
          8,
          winningLines && winningLines.includes(8)
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
      </div>
    </div>
  );
};

export default Board;
