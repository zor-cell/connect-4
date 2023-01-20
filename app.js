const SETTINGS = {
    rows: 6,
    cols: 7,
    startingPlayer: 1,
    depth: 6,
};

let board = Array.from({length: SETTINGS.rows}, () => Array.from({length: SETTINGS.cols}, () => 0));
let height = Array.from({length: SETTINGS.cols}, () => 0);
let currentPlayer = SETTINGS.startingPlayer;

//map for which moves are better depending on column
let moveMap = Array.from({length: SETTINGS.rows}, () => Array.from({length: SETTINGS.cols}, () => 0));

//let totalMoves = [];

function App() {
    const [depth, setDepth] = React.useState(SETTINGS.depth);
    const [totalMoves, setTotalMoves] = React.useState([]);

    const [forceRender, setForceRender] = React.useState(false);

    function getBestMove() {
        document.getElementById("result").innerHTML = "Computing result...";
        
        //wait for module to initialize,
        /*createModule().then(({Game}) => {
            //perform computation
            const game = new Game();
            let result = game.run();
            console.log(result)

            document.getElementById("result").innerHTML = result;
        });*/

        let vectorBoard = vector2dFromArray2d(board);
        let vectorHeight = vectorFromArray(height);

        //create instance of C++ game class via embind
        let game = new Module.Game(vectorBoard, vectorHeight, depth, totalMoves.length);
        let result = game.bestMove(depth, false);
        console.log(result);

        game.delete();

        document.getElementById("result").innerHTML = "Move: " + result.move + " | Score: " + result.score;

        return result.move;
    }

    //check if given move is possible
    function validMove(col) {
        return height[col] < SETTINGS.rows;
    }

    //set piece in given column if possible
    function dropPiece(col) {
        if(validMove(col)) {
            let row = SETTINGS.rows - 1 - height[col];

            //player 1
            board[row][col] = currentPlayer;
            height[col]++;

            setTotalMoves(totalMoves => [...totalMoves, col]);

            //player switch
            if(currentPlayer === 1) {
                currentPlayer = 2;
                dropPiece(getBestMove());
            } else {
                currentPlayer = 1;
            }
            
            console.log(totalMoves);
            setForceRender(!forceRender);
        }
    }

    function setCellColor(cellValue) {
        if(cellValue === 1) return 'player1';
        else if(cellValue === 2) return 'player2';

        return 'empty';
    }

    function changeDepth(event) {
        setDepth(event.target.value);
    }

    function undoMove(event) {
        if(totalMoves.length == 0) return;

        let temp = [...totalMoves];

        //undo 2 last moves made
        for(let _ = 0;_ < 2;_++) {
            let move = temp[temp.length - 1];

            for(let i = 0;i < board.length;i++) {
                if(board[i][move] != 0) {
                    board[i][move] = 0;
                    height[move]--;
                    temp.pop();
                    break;
                }
            }
        }
        console.log(temp, "test")
        
        //update moves array
        setTotalMoves(temp);
    }

    return (
        <React.Fragment>
            {console.log("render")}
            <h1>Connect 4</h1>

            <table className="board">
                <tbody>
                    {board.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex} className="row">
                                {row.map((cell, columnIndex) => {
                                    return <td key={columnIndex} className="cell"  onClick={() => {
                                        dropPiece(columnIndex);                           
                                    }}>
                                        <div className={`piece ${setCellColor(cell)}`}></div>
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            
            <h3>Depth: {depth}</h3>
            <h3>Moves: {(totalMoves.length == 0 ? "-" : totalMoves.map(move => {return move + " ";}))}</h3>
            
            <button onClick={undoMove}>Undo</button>
            <input type="range" className="test" min="1" max="10" value={depth} onChange={changeDepth}></input>

            <h2>Result</h2>
            <h3 id="result">No Result</h3>
        </React.Fragment>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);

//HELPER FUNCTIONS

//create vector<int> (C++) from array (JS) via embind Module
//this vector<int> can be passed to functions in embind Module
function vectorFromArray(array) {
    let vector = new Module.Vector();

    for(let i = 0;i < array.length;i++) {
        vector.push_back(array[i]);
    }

    return vector;
}

//create vector<vector<int>> (C++) from array2d (JS) via embind Module
//this vector<vector<int>> can be passed to functions in embind Module
function vector2dFromArray2d(array2d) {
    let vector2d = new Module.Vector2D();

    for(let i = 0;i < array2d.length;i++) {
        let row = vectorFromArray(array2d[i]);
        vector2d.push_back(row);
    }

    return vector2d;
}