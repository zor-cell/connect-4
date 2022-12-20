#include "game.hpp"

Game::Game() {
    srand(time(NULL));

    initBoard();
    printBoard();
}

void Game::initBoard() {
    board.resize(ROWS, std::vector<int>(COLS));

    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            board[i][j] = 0;
        }
    }
}

void Game::printBoard() {
    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            std::cout << board[i][j] << " ";
        }
        std::cout << "\n";
    }
}

int Game::run() {
    return rand() % 10;
}