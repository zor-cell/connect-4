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
        document.getElementById("result").innerHTML = "Computing Move...";

        //enable mouselock
        
        //return promise of module initialisation
        return createModule().then(({Game, Vector, Vector2D}) => {
            let vectorBoard = vector2dFromArray2d(board, Vector, Vector2D);
            let vectorHeight = vectorFromArray(height, Vector);

            //create instance of C++ game class via embind
            let game = new Game(vectorBoard, vectorHeight, depth, totalMoves.length);
            //perform computations
            let result = game.bestMove(depth, false);
            console.log("c++ result", result)

            game.delete();

            document.getElementById("result").innerHTML = "Move: " + result.move + " | Score: " + result.score;

            return result.move;
        });
        
        //create instance of C++ game class via embind
        /*let game = new Module.Game(vectorBoard, vectorHeight, depth, totalMoves.length);
        let result = game.bestMove(depth, false);
        //console.log(result);

        game.delete();

        document.getElementById("result").innerHTML = "Move: " + result.move + " | Score: " + result.score;*/
    }

    //check if given move is possible
    function validMove(col) {
        return height[col] < SETTINGS.rows;
    }

    function winningPosition() {
        const position = {
            win: false,
            player: null,
            indices: [],
        }

        return position;
    }

    //set piece in given column if possible
    async function dropPiece(col) {
        if(validMove(col)) {
            let row = SETTINGS.rows - 1 - height[col];

            board[row][col] = currentPlayer;
            height[col]++;

            setTotalMoves(totalMoves => [...totalMoves, col]);

            //player switch
            if(currentPlayer === 1) {
                currentPlayer = 2;
                let move = await getBestMove();
                console.log("MOVE: ", move);
                dropPiece(move);
            } else {
                currentPlayer = 1;
            }
            
            setForceRender(!forceRender);
        }
    }

    function setCellColor(i, j) {
        //color last move differently
        let col = totalMoves[totalMoves.length - 1];
        let row = SETTINGS.rows - height[col];
        if(row == i && col == j) return 'move';

        return 'empty';
    }

    function setPieceColor(cellValue, i, j) {
        if(cellValue != 0) {
            console.log(cellValue, i, j);
        }

        if(cellValue === 1) return 'player1';
        else if(cellValue === 2) return 'player2';

        return 'None';
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
        //update moves array
        setTotalMoves(temp);
    }

    return (
        <React.Fragment>
            {console.log("RENDER")}
            <h1>Connect 4</h1>

            <table className="board mouseloc">
                <tbody>
                    {board.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex} className="row">
                                {row.map((cell, columnIndex) => {
                                    return <td key={columnIndex} className={`cell ${setCellColor(rowIndex, columnIndex)}`}
                                        onClick={() => {dropPiece(columnIndex);}}>
                                            <div className={`piece ${setPieceColor(cell, rowIndex, columnIndex)}`}></div>
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
function vectorFromArray(array, Vector) {
    let vector = new Vector();

    for(let i = 0;i < array.length;i++) {
        vector.push_back(array[i]);
    }

    return vector;
}

//create vector<vector<int>> (C++) from array2d (JS) via embind Module
//this vector<vector<int>> can be passed to functions in embind Module
function vector2dFromArray2d(array2d, Vector, Vector2D) {
    let vector2d = new Vector2D();

    for(let i = 0;i < array2d.length;i++) {
        let row = vectorFromArray(array2d[i], Vector);
        vector2d.push_back(row);
    }

    return vector2d;
}