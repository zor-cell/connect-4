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

let disable = false;
//let totalMoves = [];

function App() {
    const [depth, setDepth] = React.useState(SETTINGS.depth);
    const [totalMoves, setTotalMoves] = React.useState([]);

    const [gameOver, setGameOver] = React.useState(false);

    const [forceRender, setForceRender] = React.useState(false);

    //run c++ algorithm to determine best move, return algorithm result as promise
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

    //check if a win is in the current board position
    function winningPosition() {
        let position = {
            win: false,
            player: null,
            cells: [],
        }

        let count;
        for(let player = 1;player <= 2;player++) {
            for(let i = 0; i < SETTINGS.rows; i++) {
                for(let j = 0; j < SETTINGS.cols; j++) {
                    //HORIZONTAL
                    count = 0;
                    for(let k = 0; k < 4; k++) {
                        if(j - k >= 0 && board[i][j - k] == player) count++;
                        else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: []};

                    //VERTICAL
                    count = 0;
                    for(let k = 0; k < 4; k++) {
                        if(i - k >= 0 && board[i - k][j] == player) count++;
                        else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: []};

                    //DIAGONAL LEFT
                    count = 0;
                    for(let k = 0; k < 4; k++) {
                        if(i - k >= 0 && j - k >= 0 && board[i - k][j - k] == player) count++;
                        else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: []};

                    //DIAGONAL RIGHT
                    count = 0;
                    for(let k = 0; k < 4; k++) {
                        if(i + k < SETTINGS.rows && j - k >= 0 && board[i + k][j - k] == player) count++;
                        else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: []};
                }
            }
        }

        return position;
    }

    //set piece in given column if possible
    async function dropPiece(event, col) {
        //check first because of undo move
        let winPosition = winningPosition();
        if(winPosition.win) {
            console.log(winPosition);
            setGameOver(true);
        } else {
            setGameOver(false);
        }

        console.log(gameOver);


        if(gameOver) return;

        if(event != null) {
            //console.log(event, disable);
            let b = document.getElementById("board");
            if(b.className === "board mouselock") return;

            //if(disable) return;
        }

        if(validMove(col)) {
            let row = SETTINGS.rows - 1 - height[col];

            board[row][col] = currentPlayer;
            height[col]++;

            setTotalMoves(totalMoves => [...totalMoves, col]);

            //player switch
            if(currentPlayer === 1) {
                currentPlayer = 2;
                
                let b = document.getElementById("board");
                b.className = "board mouselock";
                
                disable = true;
                let move = await getBestMove();
                //console.log("MOVE: ", move);

                dropPiece(null, move);
                
                //disable = false;

            } else {
                currentPlayer = 1;
                let b = document.getElementById("board");
                b.className = "board";
                //disable = false;
            }
            
            setForceRender(!forceRender);
        }
    }

    //set cell background-color with class names and css
    function setCellColor(i, j) {
        //color last move differently
        let col = totalMoves[totalMoves.length - 1];
        let row = SETTINGS.rows - height[col];
        if(row == i && col == j) return 'move';

        return 'empty';
    }

    //set piece background-colors with class names and css
    function setPieceColor(cellValue) {
        if(cellValue === 1) return 'player1';
        else if(cellValue === 2) return 'player2';

        return 'None';
    }

    //set depth according to sider value
    function changeDepth(event) {
        setDepth(event.target.value);
    }

    //undo the last 2 moves (player and computer)
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

            <table id="board" className="board">
                <tbody>
                    {board.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex} className="row">
                                {row.map((cell, columnIndex) => {
                                    return <td key={columnIndex} className={`cell ${setCellColor(rowIndex, columnIndex)}`}
                                        onClick={(event) => {dropPiece(event, columnIndex);}}>
                                            <div className={`piece ${setPieceColor(cell)}`}></div>
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
            <input type="range" className="test" min="1" max="13" value={depth} onChange={changeDepth}></input>

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