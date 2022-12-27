#include "game.hpp"

Game::Game() {
    srand(time(NULL));

    initBoard();
    printBoard();

    std::cout << "Exit Status: " << run() << std::endl;
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

int Game::run() {
    while(gameActive) {
        int player = 1 + moves % 2;

        if(player == 1) inputCol();
        else chooseCol();
    }

    return exitStatus;
}

bool Game::isValidMove(int col) {
    return height[col] < COLS;
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

void Game::inputCol() {
    int col;
    std::cin >> col;

    if(isValidMove(col)) makeMove(col, 1 + moves % 2);
    else inputCol();
}

void Game::chooseCol() {
    int col = 0;//rand() % COLS;
    if(isValidMove(col)) makeMove(col, 1 + moves % 2);
    else chooseCol();
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