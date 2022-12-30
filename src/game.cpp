#include "game.hpp"

Game::Game(std::vector<std::vector<int>> _board, std::vector<int> _height, int _depth) : board(_board), height(_height), DEPTH(_depth) {
    srand(time(NULL));

    ROWS = board.size();
    COLS = board[0].size();

    printBoard();
}

void Game::initBoard() {
    board.resize(ROWS, std::vector<int>(COLS));
    height.resize(COLS);
    moves = 0;

    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            board[i][j] = 0;
        }
    }
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

int Game::bestMove() {
    //test
    for(int i = 0;i < COLS;i++) {
        if(isValidMove(i)) return i;
    }






    return -1;
}

int Game::minimax(int depth, bool maximizing) {
    if(depth == 0) {
        return -10;
    }
}

bool Game::isValidMove(int col) {
    return height[col] < ROWS;
}

void Game::makeMove(int col, int player) {
    board[ROWS - 1 - height[col]][col] = player;
    height[col]++;

    moves++;

    printBoard();

    if(isWinningMove(col, player)) {
        std::cout << player << " won\n";
        exitStatus = (player == 1 ? P1_WIN : P2_WIN);
        gameActive = false;
    }
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