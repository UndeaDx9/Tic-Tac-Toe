/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, RotateCcw, Trophy } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: Player[]) => {
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
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((square) => square !== null)) {
      return { winner: 'Draw' as const, line: null };
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 font-sans text-neutral-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 text-center border-b border-neutral-100">
          <h1 className="text-4xl font-bold tracking-tight mb-2">X vs O</h1>
          <p className="text-neutral-500 font-medium">Classic Tic-Tac-Toe</p>
        </div>

        {/* Status Bar */}
        <div className="px-8 py-4 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${isXNext && !winner ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-neutral-400'}`}>
              <X size={20} strokeWidth={2.5} />
            </div>
            <div className={`p-2 rounded-lg transition-colors ${!isXNext && !winner ? 'bg-rose-100 text-rose-600' : 'bg-white text-neutral-400'}`}>
              <Circle size={20} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            {winner ? (
              <span className="text-neutral-900">Game Over</span>
            ) : (
              <span>{isXNext ? "X's Turn" : "O's Turn"}</span>
            )}
          </div>
        </div>

        {/* Game Board */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-3 aspect-square">
            {board.map((square, i) => {
              const isWinningSquare = winningLine?.includes(i);
              return (
                <motion.button
                  key={i}
                  whileHover={!square && !winner ? { scale: 1.02, backgroundColor: '#f5f5f5' } : {}}
                  whileTap={!square && !winner ? { scale: 0.95 } : {}}
                  onClick={() => handleClick(i)}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-300 border-2 
                    ${isWinningSquare 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' 
                      : square 
                        ? 'bg-white border-neutral-100 text-neutral-800' 
                        : 'bg-neutral-50 border-transparent hover:border-neutral-200'
                    }`}
                  id={`square-${i}`}
                >
                  <AnimatePresence mode="wait">
                    {square === 'X' && (
                      <motion.div
                        key="X"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                      >
                        <X size={40} strokeWidth={3} className={isWinningSquare ? 'text-emerald-600' : 'text-indigo-600'} />
                      </motion.div>
                    )}
                    {square === 'O' && (
                      <motion.div
                        key="O"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Circle size={36} strokeWidth={3} className={isWinningSquare ? 'text-emerald-600' : 'text-rose-600'} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Footer / Results */}
        <div className="p-8 pt-0">
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className={`p-4 rounded-2xl flex items-center justify-center gap-3 ${winner === 'Draw' ? 'bg-neutral-100 text-neutral-600' : 'bg-emerald-50 text-emerald-700'}`}>
                  {winner !== 'Draw' ? (
                    <>
                      <Trophy size={20} />
                      <span className="font-bold text-lg">Player {winner} Wins!</span>
                    </>
                  ) : (
                    <span className="font-bold text-lg">It's a Draw!</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={resetGame}
            className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors active:scale-[0.98]"
            id="reset-button"
          >
            <RotateCcw size={18} />
            Reset Game
          </button>
        </div>
      </motion.div>

      <div className="mt-8 text-neutral-400 text-xs font-medium uppercase tracking-widest">
        Built with React & Tailwind
      </div>
    </div>
  );
}
