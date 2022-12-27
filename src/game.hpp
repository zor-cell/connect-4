#ifndef H_GAME_HPP
#define H_GAME_HPP

#include "stdafx.hpp"

//P1_WIN: player 1 won the game
//P2_WIN. player 2 won the game
//TIE: the game is a tie as the board is filled with no winner
//UNDEFINED: should never be returned, is the default value
enum ExitStatus {TIE, P1_WIN, P2_WIN, UNDEFINED};

class Game {
    private:
        const int ROWS = 6;
        const int COLS = 7;

        //board representation 0 = empty, 1 = player1, 2 = player2
        std::vector<std::vector<int>> board;
        //store the number of stones in each column
        std::vector<int> height;

        //indicates if game is running or stopped
        bool gameActive = true;
        //number of moves played by both players
        int moves;

        //ONLY WEBASSEMBLY
        //value of stopped game to pass to front-end
        ExitStatus exitStatus = UNDEFINED;

    public:
        Game();

        void initBoard();
        void printBoard();

        bool isValidMove(int col);
        void makeMove(int col, int player);

        void inputCol();
        void chooseCol();

        //check if player won after move
        bool isWinningMove(int col, int player);

        int run();
};
#endif