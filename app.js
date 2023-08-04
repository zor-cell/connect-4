const SETTINGS = {
    rows: 6,
    cols: 7,
    startingPlayer: 1,
    depth: 11,
};

let board = Array.from({length: SETTINGS.rows}, () => Array.from({length: SETTINGS.cols}, () => 0));
let height = Array.from({length: SETTINGS.cols}, () => 0);
let currentPlayer = SETTINGS.startingPlayer;

//not with useState because update on count has to be immediate
let moveCount = 0;
let gameOver = false;
let movesBit = [];

initBoard();

function initBoard() {
    console.log(board, height);

    for(let i = 0;i < board.length;i++) {
        for(let j = 0;j < board[i].length;j++) {
            board[i][j] = 0;
        }
    }

    for(let i = 0;i < height.length;i++) {
        height[i] = 0;
    }
    //TESTING
    /*board = [
        [0, 2, 0, 2, 1, 0, 0],
        [0, 2, 0, 1, 2, 0, 0],
        [0, 1, 0, 2, 2, 0, 2],
        [2, 2, 0, 1, 1, 0, 1],
        [1, 1, 2, 2, 1, 0, 1],
        [2, 2, 1, 1, 2, 1, 1]
    ];

    height = [3, 6, 2, 6, 6, 1, 4];*/
}

function App() {
    const [depth, setDepth] = React.useState(SETTINGS.depth);
    const [startingPlayer, setStartingPlayer] = React.useState(SETTINGS.startingPlayer);

    //list of played moves
    const [totalMoves, setTotalMoves] = React.useState([]);

    //store indices of winning pieces in case winning position was reached
    const [winMoves, setWinMoves] = React.useState([]);

    //check if given move is possible
    function isValidMove(col) {
        return height[col] < SETTINGS.rows;
    }

    //check if a win is in the current board position
    function boardState() {
        let position = {
            //-1 = undefined, 0 = draw, 1 = player1 win, 2 = player2 win
            state: -1,
            cells: [],
        }

        //count of consecutive pieces
        let count;
        //indices of consecutive pieces
        let cells;
        for(let player = 1;player <= 2;player++) {
            for(let i = 0; i < SETTINGS.rows; i++) {
                for(let j = 0; j < SETTINGS.cols; j++) {
                    //HORIZONTAL
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(j - k >= 0 && board[i][j - k] == player) {
                            cells.push({i: i, j: j - k});
                            count++;
                        } else break;
                    }
                    if(count >= 4) position = {state: player, cells: cells};

                    //VERTICAL
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(i - k >= 0 && board[i - k][j] == player) {
                            cells.push({i: i - k, j: j});
                            count++;
                        } else break;
                    }
                    if(count >= 4) position = {state: player, cells: cells};

                    //DIAGONAL LEFT
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(i - k >= 0 && j - k >= 0 && board[i - k][j - k] == player) {
                            cells.push({i: i - k, j: j - k});
                            count++;
                        } else break;
                    }
                    if(count >= 4) position = {state: player, cells: cells};

                    //DIAGONAL RIGHT
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(i + k < SETTINGS.rows && j - k >= 0 && board[i + k][j - k] == player) {
                            cells.push({i: i + k, j: j - k});
                            count++;
                        } else break;
                    }
                    if(count >= 4) position = {state: player, cells: cells};
                }
            }
        }

        //check for draw if no win is in position
        if(moveCount >= SETTINGS.rows * SETTINGS.cols) return {state: 0, cell: []};

        return position;
    }

    function makeMove(col, isHuman) {
        //dont allow move from human while its computers turn
        if(isHuman && currentPlayer != 1) return;

        //dont allow move if game is over
        if(gameOver) return;

        if(isValidMove(col)) {
            //update board
            let row = SETTINGS.rows - 1 - height[col];
            board[row][col] = currentPlayer;
            height[col]++;

            //update moves list
            moveCount++;
            setTotalMoves(totalMoves => [...totalMoves, col]);
            movesBit.push(col);

            //check for win or draw in position
            let state = boardState();
            if(state.state == 0) {
                document.getElementById("result").innerHTML = "Draw!";

                gameOver = true;
                return;
            } else if(state.state > 0) {
                document.getElementById("result").innerHTML = "Player " + state.state + " won!";

                setWinMoves(state.cells);

                gameOver = true;
                return;
              }

            currentPlayer = (currentPlayer === 1 ? 2 : 1);
            if(isHuman) makeMoveComputer();
        }
    }

    //use web worker to call backend script
    function makeMoveComputer() {
        document.getElementById("result").innerHTML = "Computing Move...";
        document.getElementById("board").className = "board loading";

        const worker = new Worker('worker.js');
        worker.postMessage({
            type: 'RUN',
            payload: {
                depth: depth,
                board: board,
                height: height,
                moves: movesBit
            }
        });

        //receive result as message from web worker
        worker.onmessage = function(message) {
            if(message.data.type === 'RESULT') {
                const move = message.data.payload.move;
                const score = message.data.payload.score;

                document.getElementById("result").innerHTML = "Move: " + move + " | Score: " + score;//readScore(score);
                document.getElementById("board").className = "board";

                makeMove(move, false);
            }
        }
    }

    function readScore(score) {
        //+1 because makeMove is called afterwards
        let moves = moveCount + 1;

        let message = "";
        if(score < 0) message = "Player 2 in ";
        else if(score > 0) message = "Player 1 in ";

        message += SETTINGS.rows * SETTINGS.cols - moves - Math.abs(score);

        return message;
    }

    //undo the last 2 moves (player and computer)
    function undoMove() {
        if(totalMoves.length == 0) return;

        let temp = [...totalMoves];
        
        //undo 2 last moves made
        for(let _ = 0;_ < 2; _++) {
            let move = temp[temp.length - 1];

            for(let i = 0;i < board.length;i++) {
                if(board[i][move] != 0) {
                    board[i][move] = 0;
                    height[move]--;

                    temp.pop();
                    movesBit.pop();
                    moveCount--;
                    break;
                }
            }
        }
        //update moves array
        setTotalMoves(temp);

        //if position was win position, continue game
        if(gameOver) {
            setWinMoves([]);

            gameOver = false;
        }
    }

    //set cell background-color with class names and css
    function setCellColor(i, j) {
        //winning moves
        if(winMoves.length > 0) {
            for(let move of winMoves) {
                if(i == move.i && j == move.j) return 'win';
            }
        }

        //last move
        if(totalMoves.length > 0) {
            let col = totalMoves[totalMoves.length - 1];
            let row = SETTINGS.rows - height[col];
            if(row == i && col == j) return 'move';
        }

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

    function startingMove() {
        if(moveCount === 0 && startingPlayer != 1) {
            makeMoveComputer();
        }
    }

    async function startNewGame() {
        initBoard();

        moveCount = 0;
        gameOver = false;
        currentPlayer = (startingPlayer === 1 ? 2 : 1);

        setDepth(depth);
        setTotalMoves([]);
        setWinMoves([]);
        setStartingPlayer(currentPlayer);

        //if computer starts sleep 
        if(currentPlayer != 1) await new Promise(resolve => setTimeout(resolve, 2000));
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
                                        onClick={() => {makeMove(columnIndex, true);}}>
                                            <div className={`piece ${setPieceColor(cell)}`}></div>
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {console.log(startingPlayer)}
            {startingMove()}
            
            <h3>Moves: {(totalMoves.length == 0 ? "Player " + startingPlayer + " starts!" : totalMoves.map(move => {return move + " ";}))}</h3>
            <h3 id="result">No Result</h3>

            <div className="settings">
                <div>
                    <input type="range" className="test" min="1" max="13" value={depth} onChange={changeDepth}></input>
                    <h3>Depth: {depth}</h3>
                </div>
                <button onClick={undoMove}>Undo</button>
                <button onClick={startNewGame}>New Game</button>
            </div>
        </React.Fragment>
    );
}

ReactDOM.render(
    <App/>,
    document.getElementById('container')
);