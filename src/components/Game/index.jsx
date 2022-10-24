import '../../index.css';
import Board from "../Board";
import React, { useState } from 'react';
function Game(props) {
    const [size, setSize] = useState(3);
    const [history, setHistory] = useState([
        {
            squares: Array(size).fill(null).map(() => Array(size).fill(null)),
            position: null,
            isBold: false
        }
    ]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isSortAscending, setIsSortAscending] = useState(true);
    const handleClick = (row, col) => {
        console.log("Row, col", row, col)
        const his = history.slice(0, stepNumber + 1);
        console.log("His", his);
        const current = his[his.length - 1];
        const squares = current.squares.slice();
        const calcWinner = calculateWinner(squares);
        if (calcWinner || squares[row][col]) {
            return;
        }
        current.isBold = false;
        squares[row] = squares[row].slice();
        squares[row][col] = xIsNext ? 'X' : 'O';
        setHistory(his.concat([{
            squares,
            position: { row, col },
            isBold: true
        }]))
        setStepNumber(his.length);
        setXIsNext(!xIsNext);
    }
    const jumpTo = (step, move) => {
        console.log("Step", step);
        console.log("Move", move);
        setHistory(history => history.map((item, index) => {
            if (index === move) {
                item.isBold = true;
            } else {
                item.isBold = false;
            }
            return item;
        }))
        setStepNumber(move);
        setXIsNext((move % 2) === 0);
    }
    const handleSortHistory = () => {
        setIsSortAscending(!isSortAscending);
    }
    const render = () => {
        const current = history[stepNumber];
        const calcWinner = calculateWinner(current.squares);
        let status;
        const winningSquares = calcWinner?.lines ?? [];
        if (calcWinner && calcWinner.type === 'win') {
            const winner = calcWinner?.winner ?? '';
            status = 'Winner: ' + winner;
        } else if (calcWinner && calcWinner.type === 'draw') {
            status = 'Game Over: Draw';
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        let message = '';
        if (calcWinner && calcWinner.type === 'draw') {
            message = 'Draw Match';
        }
        return (
            <>
                <div className="game-title">
                    Tic Tac Toe
                </div>
                <div className="game">
                    <div className="game-container">
                        <div className="status">{status}</div>
                        <div className="game-board">
                            <Board
                                size={size}
                                squares={current.squares}
                                winningSquares={winningSquares}
                                onClick={(row, col) => handleClick(row, col)}
                            />
                        </div>
                        <p style={{ color: "red" }}>
                            <strong>
                                {message}
                            </strong>
                        </p>
                    </div>
                    <div className="game-info">
                        <p className='history-title'>History Match</p>
                        <div className="sort-wrapper">
                            <p>
                                {
                                    isSortAscending ? 'Ascending' : 'Descending'
                                }
                            </p>
                            <label className="switch">
                                <input type="checkbox" onClick={() => handleSortHistory()} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <ol>{
                            history.map((step, move) => {
                                const desc = move ?
                                    'Go to move #' + move :
                                    'Go to game start';
                                const position = step.position ? `(${step.position.col},${step.position.row})` : '';
                                return (
                                    <li key={move}>
                                        <button className='history-btn' onClick={() => jumpTo(step, move)}>
                                            {step.isBold ? <b>{desc}</b> : desc}
                                            <span> {position} </span>
                                        </button>
                                    </li>
                                );
                            }).sort((a, b) => {
                                if (isSortAscending) {
                                    return a.key - b.key;
                                }
                                return b.key - a.key;
                            })
                        }</ol>
                    </div>
                </div>
            </>
        );
    }
    return render();
}

function calculateWinner(squares) {
    // check rows
    const size = squares.length;
    for (let i = 0; i < size; i++) {
        const row = squares[i];
        // console.log("Row: ", row);
        if (row && !row.includes(null)) {
            const first = row[0];
            if (row.every((value) => value === first)) {
                const lines = Array.from({ length: size }, (_, idx) => {
                    return { row: i, col: idx }
                })
                console.log("Lines", lines);
                return {
                    type: 'win',
                    winner: first,
                    lines
                };
            }
        }
    }
    // check columns
    for (let i = 0; i < size; i++) {
        const column = squares.map((row) => row[i]);
        if (column && !column.includes(null)) {
            const first = column[0];
            if (column.every((value) => value === first)) {
                const lines = Array.from({ length: size }, (_, idx) => {
                    return { row: idx, col: i }
                });
                console.log("Lines", lines);
                return {
                    type: 'win',
                    winner: first,
                    lines
                };
            }
        }
    }
    // check diagonals
    const diagonal1 = squares.map((row, index) => row[index]);
    if (diagonal1 && !diagonal1.includes(null)) {
        const first = diagonal1[0];
        if (diagonal1.every((value) => value === first)) {
            const lines = Array.from({ length: size }, (_, idx) => {
                return { row: idx, col: idx }
            });
            console.log("Lines", lines);
            return {
                type: 'win',
                winner: first,
                lines
            };
        }
    }
    const diagonal2 = squares.map((row, index) => row[size - index - 1]);
    if (diagonal2 && !diagonal2.includes(null)) {
        const first = diagonal2[0];
        if (diagonal2.every((value) => value === first)) {
            const lines = Array.from({ length: size }, (_, idx) => {
                return { row: idx, col: size - idx - 1 }
            });
            console.log("Lines", lines);
            return {
                type: 'win',
                winner: first,
                lines
            };
        }
    }
    if (squares.every(row => row.every(value => value !== null))) {
        return {
            type: 'draw',
            winner: null,
            lines: []
        }
    }
    return null;
}
export default Game;