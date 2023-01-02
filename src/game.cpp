#include "game.hpp"

Game::Game(std::vector<std::vector<int>> _board, std::vector<int> _height, int _depth) : board(_board), height(_height), DEPTH(_depth) {
    srand(time(NULL));

    ROWS = board.size();
    COLS = board[0].size();

    moves = 0;

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

    std::cout << "Depth: " << depth << ", Moves: ";
    for(int i : m) {
        std::cout << i << " ";
    }
    std::cout << "\n";

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
    if(depth == 0) {
        if(board[5][3]) return {-1, 5};
        //move is -1 because it is set in if branches
        return {-1, currentEval()};
    }

    if(maximizing) {
        int maxEval = INFINITY_NEG;
        int bestMove = -1;

        std::vector<int> possibleMoves = getPossibleMoves();

        for(int move : possibleMoves) {
            makeMove(move, maximizing + 1);
            int curEval = minimax(depth - 1, 0, 0, false).score;
            undoMove(move);

            if(curEval > maxEval) {
                maxEval = curEval;
                bestMove = move;
            }
        }

        return {bestMove, maxEval};
    } else {
        int minEval = INFINITY_POS;
        int bestMove = -1;

        std::vector<int> possibleMoves = getPossibleMoves();

        for(int move : possibleMoves) {
            makeMove(move, maximizing + 1);
            int curEval = minimax(depth - 1, 0, 0, false).score;
            undoMove(move);

            if(curEval < minEval) {
                minEval = curEval;
                bestMove = move;
            }
        }

        return {bestMove, minEval};
    }
}

int Game::currentEval() {
    return 1;
}

bool Game::isValidMove(int col) {
    return height[col] < ROWS;
}

void Game::makeMove(int col, int player) {
    board[ROWS - 1 - height[col]][col] = player;
    height[col]++;

    moves++;

    //printBoard();

    if(isWinningMove(col, player)) {
        std::cout << player << " won\n";
        exitStatus = (player == 1 ? P1_WIN : P2_WIN);
        gameActive = false;
    }
}
void Game::undoMove(int col) {
    if(height[col] < 1) {
        std::cout << "undo called on empty col: " << col << std::endl;
        return;
    }

    board[ROWS - height[col]][col] = 0;

    height[col]--;
    moves--;
}

bool Game::isWinningMove(int col, int player) {
    int row = ROWS - height[col];

    //VERTICAL
    int count = 0;
    if(height[col] >= 4) {
        for(int i = 0;i < 4;i++) {
            if(board[row + i][col] == player) count++;
            else break;
        }
    }
    if(count >= 4) return true;

    //HORIZONTAL
    count = 0;
    for(int j = 0;j < 4;j++) {

    }

    return false;
}