importScripts('main.js');

onmessage = function(message) {
  if (message.data.type === 'RUN') {
    createModule().then(({Game, Vector, Vector2D}) => {
        let depth = parseInt(message.data.payload.depth);
        const board = message.data.payload.board;
        const height = message.data.payload.height;
        const moves = message.data.payload.moves;

        const vectorBoard = vector2dFromArray2d(board, Vector, Vector2D);
        const vectorHeight = vectorFromArray(height, Vector);
        const vectorMoves = vectorFromArray(moves, Vector);
        
        //create instance of C++ game class via embind
        const game = new Game(vectorBoard, vectorHeight, vectorMoves);
        //perform computations
        const result = game.bestMove(depth, false);
        //delete instance for memory management
        game.delete();

        //share result with message
        postMessage({
            type: 'RESULT',
            payload: {
                move: result.move,
                score: result.score
            }
        });
    });
  }
};

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