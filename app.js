const SETTINGS = {
    rows: 6,
    cols: 7,
    startingPlayer: 1,
    depth: 6,
};

let board = Array.from({length: SETTINGS.rows}, () => Array.from({length: SETTINGS.cols}, () => 0));
let height = Array.from({length: SETTINGS.cols}, () => 0);
let currentPlayer = SETTINGS.startingPlayer;

let gameOver = false;

function App() {
    const [depth, setDepth] = React.useState(SETTINGS.depth);
    //list of played moves
    const [totalMoves, setTotalMoves] = React.useState([]);
    //store indices of winning pieces in case winning position was reached
    const [winMoves, setWinMoves] = React.useState([]);

    //check if given move is possible
    function isValidMove(col) {
        return height[col] < SETTINGS.rows;
    }

    //check if a win is in the current board position
    function winningPosition() {
        let position = {
            win: false,
            player: null,
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
                    if(count >= 4) position = {win: true, player: player, cells: cells};

                    //VERTICAL
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(i - k >= 0 && board[i - k][j] == player) {
                            cells.push({i: i - k, j: j});
                            count++;
                        }else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: cells};

                    //DIAGONAL LEFT
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(i - k >= 0 && j - k >= 0 && board[i - k][j - k] == player) {
                            cells.push({i: i - k, j: j - k});
                            count++;
                        } else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: cells};

                    //DIAGONAL RIGHT
                    count = 0;
                    cells = [];
                    for(let k = 0; k < 4; k++) {
                        if(i + k < SETTINGS.rows && j - k >= 0 && board[i + k][j - k] == player) {
                            cells.push({i: i + k, j: j - k});
                            count++;
                        } else break;
                    }
                    if(count >= 4) position = {win: true, player: player, cells: cells};
                }
            }
        }

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
            setTotalMoves(totalMoves => [...totalMoves, col]);

            //check for win in position
            let winPosition = winningPosition();
            if(winPosition.win) {
                document.getElementById("result").innerHTML = "Player " + winPosition.player + " won!";

                setWinMoves(winPosition.cells);

                gameOver = true;
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
                height: height
            }
        });

        worker.onmessage = function(message) {
            if(message.data.type === 'RESULT') {
                const move = message.data.payload.move;
                const score = message.data.payload.score;

                document.getElementById("result").innerHTML = "Move: " + move + " | Score: " + score;
                document.getElementById("board").className = "board";

                makeMove(move, false);
            }
        }
    }

    //undo the last 2 moves (player and computer)
    function undoMove() {
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

        //if position was win position, continue game
        if(gameOver) {
            setWinMoves([]);

            gameOver = false;
        }
    }

    //set cell background-color with class names and css
    function setCellColor(i, j) {
        //color winning moves
        if(winMoves.length > 0) {
            for(let move of winMoves) {
                if(i == move.i && j == move.j) return 'win';
            }
        }

        //color last move
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