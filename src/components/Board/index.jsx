import '../../index.css';
import Square from "../Square";
import React from 'react';
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
export default Board;