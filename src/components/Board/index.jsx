import '../../index.css';
import Square from "../Square";
import React from 'react';
function Board (props){
    const renderSquare = (row, col) => {
        const squarePosition = {
            row: row,
            col: col
        }
        let isMarked = false;
        if (props.winningSquares) {
            isMarked = props.winningSquares.some((item) => {
                return item.row === squarePosition.row && item.col === squarePosition.col;
            });
        }
        return (
            <Square
                isMarked={isMarked}
                key={row * props.size + col}
                value={props.squares[row][col]}
                onClick={() => props.onClick(row, col)}
            />
        );
    }
    const renderRow = (i) => {
        let row = [];
        for (let j = 0; j < props.size; j++) {
            row.push(renderSquare(i, j));
        }
        return (
            <div key={i} className="board-row">
                {row}
            </div>
        );
    }
    const renderBoard = (size) => {
        let board = [];
        for (let i = 0; i < size; i++) {
            board.push(renderRow(i));
        }
        return board;
    }
    const render = () => {
        return (
            <div>
                {
                    renderBoard(props.size)
                }
            </div>
        );
    }
    return render();
}
export default Board;