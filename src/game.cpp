#include "game.hpp"

Game::Game(std::vector<std::vector<int>> _board, std::vector<int> _height, int _depth, int _moves) : board(_board), height(_height), DEPTH(_depth), moves(_moves) {
    srand(time(NULL));

    ROWS = board.size();
    COLS = board[0].size();

    heatMap.resize(ROWS, std::vector<int>(COLS));
    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            heatMap[i][j] = 5 - std::abs(COLS / 2 - j);
            std::cout << heatMap[i][j] << " ";
        }
        std::cout << "\n";
    }

    printBoard();
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
    //test
    /*for(int i = 0;i < COLS;i++) {
        if(isValidMove(i)) return i;
    }*/

    std::vector<int> m = getPossibleMoves();

    std::cout << "Total Moves: " << moves << ", Depth: " << depth
    << ", Player: " << 1 + moves % 2 << ", Maximizing: " << maximizing << "\n";

    return minimax(depth, INFINITY_NEG, INFINITY_POS, maximizing);
}

std::vector<int> Game::getPossibleMoves() {
    std::vector<int> moves;

    for(int col = 0;col < COLS;col++) {
        int row = ROWS - 1 - height[col];

        if(row >= 0 && board[row][col] == 0) {
            moves.push_back(col);
        }
    }

    return moves;
}

Result Game::minimax(int depth, int alpha, int beta, bool maximizing) {
    //check for draw
    //if(moves >= ROWS * COLS) return {-1, 0};

    if(depth == 0) {
        //move is -1 because it is set in if branches
        return {-1, currentEval()};
    }

    int currentPlayer = (maximizing ? 1 : 2);

    if(maximizing) {
        Result best = {-1, INFINITY_NEG};

        //go through possible moves
        for(int move = 0; move < COLS; move++) {
            if(isValidMove(move)) {
                //return best achievable score if win is possible
                if(isWinningMove(move, currentPlayer)) return {move, INFINITY_POS};

                makeMove(move, currentPlayer);

                Result current = minimax(depth - 1, 0, 0, false);
                current.move = move;

                undoMove(move);

                if(current.score > best.score) {
                    best = current;
                }
            }
        }

        return best;
    } else {
        Result best = {-1, INFINITY_POS};

        for(int move = 0;move < COLS;move++) {
            if(isValidMove(move)) {
                if(isWinningMove(move, currentPlayer)) return {move, INFINITY_NEG};

                makeMove(move, currentPlayer);

                Result current = minimax(depth - 1, 0, 0, true);
                current.move = move;

                undoMove(move);

                if(current.score < best.score) {
                    best = current;
                }
            }
        }

        return best;
    }
}

int Game::currentEval() {
    int score = 0;

    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            if(board[i][j] == 1) score += heatMap[i][j];
            if(board[i][j] == 2) score -= heatMap[i][j];
        }
    }

    return score;
}

bool Game::isValidMove(int col) {
    return height[col] < ROWS;
}

void Game::makeMove(int col, int player) {
    board[ROWS - 1 - height[col]][col] = player;
    height[col]++;

    //moves++;

    //printBoard();

    /*if(isWinningMove(col, player)) {
        std::cout << player << " won\n";
        exitStatus = (player == 1 ? P1_WIN : P2_WIN);
        gameActive = false;
    }*/
}
void Game::undoMove(int col) {
    if(height[col] < 1) {
        std::cout << "undo called on empty col: " << col << std::endl;
        return;
    }

    board[ROWS - height[col]][col] = 0;

    height[col]--;
    //moves--;
}

bool Game::isWinningMove(int col, int player) {
    int row = ROWS - 1 - height[col];

    //VERTICAL
    int count = 0;
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

    }

    return false;
}