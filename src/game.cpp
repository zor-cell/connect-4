#include "game.hpp"

Game::Game(std::vector<std::vector<int>> _board, std::vector<int> _height) : board(_board), height(_height), transpositionTable(1000000) {
    srand(time(NULL));

    transpositionTable.print();

    ROWS = board.size();
    COLS = board[0].size();
    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            if(board[i][j] != 0) moves++;
        }
    }

    std::cout << " MOVES " << moves << std::endl;

    heatMap.resize(ROWS, std::vector<int>(COLS));
    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            heatMap[i][j] = 5 - std::abs(COLS / 2 - j);
            //std::cout << heatMap[i][j] << " ";
        }
        //std::cout << "\n";
    }

    /*for(auto i : table) {
        for(auto j : i) {
            std::cout << j << " ";
        }
        std::cout << "\n";
    }*/

    int h = transpositionTable.hashBoard(board);
    std::cout << "HASH1: " << h << std::endl;

    int b = transpositionTable.hashBoard(board);
    std::cout << "HASH2: " << b << std::endl;

    //printBoard();
}

void Game::initBoard() {
    board.resize(ROWS, std::vector<int>(COLS, 0));
    height.resize(COLS, 0);
}

void Game::printBoard() {
    std::cout << "h ";
    for(int h : height) {
        std::cout << h << " ";
    }
    std::cout << "\n";

    for(int i = 0;i < ROWS;i++) {
        std::cout << "b ";
        for(int j = 0;j < COLS;j++) {
            std::cout << board[i][j] << " ";
        }
        std::cout << "\n";
    }
    std::cout << "\n";
}

Result Game::bestMove(int depth, bool maximizing) {
    std::cout << "Total Moves: " << moves << ", Depth: " << depth
    << ", Player: " << 1 + moves % 2 << ", Maximizing: " << maximizing << "\n";

    return minimax(depth, INFINITY_NEG, INFINITY_POS, maximizing);
}

Result Game::minimax(int depth, int alpha, int beta, bool maximizing) {
    int currentPlayer = (maximizing ? 1 : 2);

    //check for draw
    if(isDraw()) return {-1, 0};

    if(depth == 0) {
        //move is -1 because it is set in if branches
        return {-2, currentEval()};
    }

    //return move if position was already evaluated
    //int hash = transpositionTable.hashBoard(board);
    //Result stored = transpositionTable.get(hash);
    /*if(stored.move != -1) {
        if(stored.score >= depth) return stored;
        //std::cout << "TRANS: " << stored.move << " " << stored.score << std::endl;
    } else {
        //std::cout << "NONTRANS: " << stored.move << " " << stored.score << std::endl;
    }*/

    if(maximizing) {
        Result best = {-3, INFINITY_NEG};

        //go through possible moves
        for(int move : moveOrder) {
            if(isValidMove(move)) {
                //update board with move
                makeMove(move, currentPlayer);

                //return best achievable score if win is possible
                if(isWinningPosition(currentPlayer)) {
                    undoMove(move);
                    //offset by one so the initialising move isnt considered as best move
                    return {move, 42 - moves + 1};
                }

                //run algorithm on board with current move played
                Result current = minimax(depth - 1, alpha, beta, false);
                current.move = move;

                //reset board to try every move
                undoMove(move);

                //update best move and score if better is found
                if(current.score > best.score) {
                    best = current;
                }

                //alpha beta pruning
                alpha = std::max(alpha, current.score);
                if(beta <= alpha) break;
            }
        }

        //insert position in transposition table
        //transpositionTable.set(hash, {best.move, depth});

        return best;
    } else {
        Result best = {-4, INFINITY_POS};

        for(int move : moveOrder) {
            if(isValidMove(move)) {
                makeMove(move, currentPlayer);
                if(isWinningPosition(currentPlayer)) {
                    undoMove(move);
                    return {move, -(42 - moves + 1)};
                }

                Result current = minimax(depth - 1, alpha, beta, true);
                current.move = move;

                undoMove(move);

                if(current.score < best.score) {
                    best = current;
                }

                beta = std::min(beta, current.score);
                if(beta <= alpha) break;
            }
        }

        //insert position in transposition table
        //transpositionTable.set(hash, {best.move, depth});

        return best;
    }
}

bool Game::isDraw() {
    for(int i = 0;i < COLS;i++) {
        if(height[i] < ROWS) return false;
    }

    return true;
}

int Game::currentEval() {
    int score = 0;

    //if(isWinningPosition(1)) return INFINITY_POS;
    //else if(isWinningPosition(2)) return INFINITY_NEG;

    /*for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            if(board[i][j] == 1) score += heatMap[i][j];
            if(board[i][j] == 2) score -= heatMap[i][j];
        }
    }*/

    return score;
}

bool Game::isValidMove(int col) {
    return height[col] < ROWS;
}

void Game::makeMove(int col, int player) {
    board[ROWS - 1 - height[col]][col] = player;
    height[col]++;

    moves++;
}

void Game::undoMove(int col) {
    //row is top stone in column
    int row = ROWS - height[col];

    //emtpy current cell
    board[row][col] = 0;

    //remove stone from col
    height[col]--;

    moves--;
}

bool Game::isWinningPosition(int player) {
    //row is one cell above top stone in column
    //int row = ROWS - 1 - height[col];

    //layout for looping over whole board
    int count;
    for(int i = 0; i < ROWS; i++) {
        for(int j = 0; j < COLS; j++) {
            //HORIZONTAL
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(j - k >= 0 && board[i][j - k] == player) count++;
                else break;
            }
            if(count >= 4) return true;

            //VERTICAL
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(i - k >= 0 && board[i - k][j] == player) count++;
                else break;
            }
            if(count >= 4) return true;

            //DIAGONAL LEFT
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(i - k >= 0 && j - k >= 0 && board[i - k][j - k] == player) count++;
                else break;
            }
            if(count >= 4) return true;

            //DIAGONAL RIGHT
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(i + k < ROWS && j - k >= 0 && board[i + k][j - k] == player) count++;
                else break;
            }
            if(count >= 4) return true;
        }
    }

    return false;


    //layout for not looping over whole board
    //VERTICAL
    /*int count = 0;
    if(height[col] >= 3) {
        for(int i = 1;i <= 3;i++) {
            if(board[row + i][col] == player) count++;
            else break;
        }
    }
    if(count >= 3) return true;

    //HORIZONTAL
    count = 0;
    for(int j = 0;j < 4;j++) {

    }*/
}