import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react'

const { Badge, Button, Card } = ReactBootstrap

function Square({ value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, selectedSquare, setSelectedSquare} ) {
  function handleClick(i) {
    if (calculateWinner(squares)) {
      return;
    }

    const player = xIsNext ? "X" : "O";
    
    if (getStage(squares, player) === "place") {
      if (squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      nextSquares[i] = player;
      onPlay(nextSquares);
    }
    else {
      if (selectedSquare === null) {
        if (squares[i] !== player) {
          return;
        }
        setSelectedSquare(i);
      }
      else {
        if (squares[i] !== null || !isAdjacent(selectedSquare, i)) {
          setSelectedSquare(null);
          return;
        }
        const nextSquares = squares.slice();
        nextSquares[selectedSquare] = null;
        nextSquares[i] = player;

        if (squares[4] === player && !calculateWinner(nextSquares) && nextSquares[4] === player) {
          setSelectedSquare(null);
          return;
        }

        setSelectedSquare(null);
        onPlay(nextSquares);
      }
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [selectedSquare, setSelectedSquare] = useState(null);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setSelectedSquare(null);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} selectedSquare={selectedSquare} setSelectedSquare={setSelectedSquare}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getStage(squares, player) {
  const count = squares.filter(x => x === player).length;
  return (count < 3 ? "place" : "move");
}

function isAdjacent(from, to) {
  const fromRow = Math.floor(from/3);
  const fromCol = from % 3;
  const toRow = Math.floor(to/3);
  const toCol = to % 3;
  if (from === to || Math.abs(toCol-fromCol) > 1 || Math.abs(toRow-fromRow) > 1) {
    return false;
  }
  else {
    return true;
  }
}