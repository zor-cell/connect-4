const ROWS = 6;
const COLS = 7;

let width = 100 / ROWS;
let height = 100 / COLS;

let board = setBoard();
console.log(board)

function setBoard() {
    let curBoard = [];

    for(let i = 0;i < ROWS;i++) {
        curBoard[i] = [];
        for(let j = 0;j < COLS;j++) {
            curBoard[i].push(0);
        }
    }

    return curBoard;
}

function App() {
    const [runs, setRuns] = React.useState(100000);

    function onCellClick(event) {
        console.log(event.target.className);
        event.stopPropagation();
    }

    function onRunsChange(event) {
        setRuns(Number(event.target.value));
    }

    function handleSubmit(event) {
        document.getElementById("result").innerHTML = "Computing result...";
        
        //stop page from reloading after submit
        event.preventDefault();

        //wait for module to initialize,
        createModule().then(({Game}) => {
            //perform computation
            const game = new Game();
            let result = game.run();

            document.getElementById("result").innerHTML = result;
        });
    }

    return (
        <div>
            <h1>My Title</h1>
            <div>
                <form id="parameters" onSubmit={handleSubmit}>
                    <span>Runs</span>
                    <input type="number" value={runs} onChange={onRunsChange}></input>

                    <input type="submit" value="Run"></input>
                </form>
            </div>

            <h2>Result</h2>
            <h3 id="result">No Result</h3>

            <table className="board">
                <thead></thead>
                <tbody>
                    {board.map((row, rowKey) => {
                        return (
                            <tr key={rowKey}>
                                {row.map((cell, cellKey) => {
                                    return (
                                        <td onClick={onCellClick} style={{width: 100/6 + "%", height: 25 + "%"}} className={rowKey.toString() + cellKey.toString()} key={cellKey}>{cell}</td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
        </div>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);