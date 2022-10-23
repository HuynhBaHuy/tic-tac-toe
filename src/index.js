import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {
                    this.props.isMarked ? (
                        <mark>{
                            this.props.value
                        }</mark>
                    ) :
                        this.props.value
                }
            </button>
        );
    }
}
class Board extends React.Component {
    renderSquare(row, col) {
        const squarePosition = {
            row: row,
            col: col
        }
        let isMarked = false;
        if (this.props.winningSquares) {
            isMarked = this.props.winningSquares.some((item) => {
                return item.row === squarePosition.row && item.col === squarePosition.col;
            });
        }
        return (
            <Square
                isMarked={isMarked}
                key={row * this.props.size + col}
                value={this.props.squares[row][col]}
                onClick={() => this.props.onClick(row, col)}
            />
        );
    }
    renderRow(i) {
        let row = [];
        for (let j = 0; j < this.props.size; j++) {
            row.push(this.renderSquare(i, j));
        }
        return (
            <div key={i} className="board-row">
                {row}
            </div>
        );
    }
    renderBoard(size) {
        let board = [];
        for (let i = 0; i < size; i++) {
            board.push(this.renderRow(i));
        }
        return board;
    }
    render() {
        return (
            <div>
                {
                    this.renderBoard(this.props.size)
                }
            </div>
        );
    }
}

class Game extends React.Component {
    handleClick(row, col) {
        console.group('===========handleClick==============');
        console.log("State Before: ", this.state);
        console.log(`click: ${row},${col}`);
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        console.log("history: ", history);
        // const current = history.map((item) => {});
        const current = history[history.length - 1];
        console.log("current: ", current);
        const squares = current.squares.slice();
        const calcWinner = calculateWinner(squares);
        console.log("calcWinner: ", calcWinner);
        if (calcWinner || squares[row][col]) {
            return;
        }
        current.isBold = false;
        squares[row] = squares[row].slice();
        squares[row][col] = this.state.xIsNext ? 'X' : 'O';
        console.log("squares: ", squares);
        this.setState({
            history: history.concat([{
                squares: squares,
                position: {
                    row: row,
                    col: col
                },
                isBold: true
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
        console.log("State After: ", this.state);
        console.groupEnd();
    }
    constructor(props) {
        super(props);
        const size = 3
        this.state = {
            history: [{
                squares: Array(size).fill(null).map(() => Array(size).fill(null)),
                position: null,
                isBold: false
            }],
            size: size,
            xIsNext: true,
            isSortAscending: true,
            stepNumber: 0
        };
    }
    jumpTo = (step, move) => {
        console.log("======JUMP-TO=======")
        console.log("step: ", step);
        console.log("move", move);
        this.setState({
            history: this.state.history.map((item, index) => {
                if (index === move) {
                    item.isBold = true;
                } else {
                    item.isBold = false;
                }
                return item;
            }),
            stepNumber: move,
            xIsNext: (move % 2) === 0
        });
    }
    handleSortHistory = () => {
        this.setState({
            isSortAscending: !this.state.isSortAscending
        })
    }
    render() {
        console.log("======RENDER=======", this.state.stepNumber)
        const history = this.state.history
        console.log("State In Render: ", this.state);
        const current = history[this.state.stepNumber];
        console.log(
            "current In Render: ",
            current
        )
        const calcWinner = calculateWinner(current.squares);
        let status;
        const winningSquares = calcWinner?.lines ?? [];
        if (calcWinner && calcWinner.type === 'win') {
            const winner = calcWinner?.winner ?? '';
            status = 'Winner: ' + winner;
        } else if (calcWinner && calcWinner.type === 'draw') {
            status = 'Game Over: Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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
                                size={this.state.size}
                                squares={current.squares}
                                winningSquares={winningSquares}
                                onClick={(row, col) => this.handleClick(row, col)}
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
                                    this.state.isSortAscending ? 'Ascending' : 'Descending'
                                }
                            </p>
                            <label className="switch">
                                <input type="checkbox" onClick={() => this.handleSortHistory()} />
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
                                        <button className='history-btn' onClick={() => this.jumpTo(step, move)}>
                                            {step.isBold ? <b>{desc}</b> : desc}
                                            <span> {position} </span>
                                        </button>
                                    </li>
                                );
                            }).sort((a, b) => {
                                if (this.state.isSortAscending) {
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
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


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