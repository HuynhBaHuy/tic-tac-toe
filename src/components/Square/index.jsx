import '../../index.css';
import React from 'react';
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
export default Square;