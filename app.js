const SETTINGS = {
    rows: 6,
    cols: 7,
    player: 2,
    depth: 3,
  };

function App() {
    //2d array as game board
    const [board, setBoard] = React.useState(
        Array.from({length: SETTINGS.rows}, () => Array.from({length: SETTINGS.cols}, () => 0))
    );
    //amount of pieces in each column
    const [height, setHeight] = React.useState(Array.from({length: SETTINGS.cols}, () => 0));
    //current player to move
    const [player, setPlayer] = React.useState(SETTINGS.player);
    

    function handleSubmit(event) {
        document.getElementById("result").innerHTML = "Computing result...";
        
        //stop page from reloading after submit
        event.preventDefault();

        //wait for module to initialize,
        createModule().then(({Game}) => {
            //perform computation
            const game = new Game();
            let result = game.run();
            console.log(result)

            document.getElementById("result").innerHTML = result;
        });
    }

    //check if given move is possible
    function validMove(col) {
        return height[col] < SETTINGS.rows;
    }

    //set piece in given column if possible
    function dropPiece(columnObject) {
        let col = columnObject.columnIndex;

        if(validMove(col)) {
            let row = SETTINGS.rows - 1 - height[col];

            //set cell at [row, col] to player
            let newBoard = board.map((curRow, i) => {
                if(i === row) {
                    return curRow.map((cell, j) => {
                        if(j === col) return player;
                        else return cell;
                    });
                } else return curRow;
            });
            setBoard(newBoard);

            //increase height at given column by 1
            let newHeight = height.map((h, i) => {
                if(i === col) return h + 1;
                else return h;
            });
            setHeight(newHeight);
            
            //switch current player
            if(player === 1) setPlayer(2)
            else setPlayer(1);

            console.log(board);
        }
    }

    function setCellColor(cellValue) {
        if(cellValue === 1) return 'player1';
        else if(cellValue === 2) return 'player2';

        return 'empty';
    }

    return (
        <React.Fragment>
            <h1>Connect 4</h1>

            <table className="board">
                <tbody>
                    {board.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex} className="row">
                                {row.map((cell, columnIndex) => {
                                    return <td key={columnIndex} className="cell"  onClick={() => dropPiece({columnIndex})}>
                                        <div className={`piece ${setCellColor(cell)}`}></div>
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <button onClick={handleSubmit}>Submit</button>

            <h2>Result</h2>
            <h3 id="reesult">No Result</h3>
        </React.Fragment>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);