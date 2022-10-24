import '../../index.css';
function Square (props) {
    const render = () => {
        return (
            <button
                className="square"
                onClick={() => props.onClick()}
            >
                {
                    props.isMarked ? (
                        <mark>{
                            props.value
                        }</mark>
                    ) :
                        props.value
                }
            </button>
        );

    }
    return render();
}
export default Square;