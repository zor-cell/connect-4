#ifndef H_GAME_HPP
#define H_GAME_HPP

#include "stdafx.hpp"

#define INFINITY_POS std::numeric_limits<int>::max()
#define INFINITY_NEG std::numeric_limits<int>::min()

//P1_WIN: player 1 won the game
//P2_WIN. player 2 won the game
//TIE: the game is a tie as the board is filled with no winner
//UNDEFINED: should never be returned, is the default value
enum ExitStatus {TIE, P1_WIN, P2_WIN, UNDEFINED};

//return type to be passed to javascript
struct Result {
    int move;
    int score;
};

class Game {
    private:
        int ROWS;
        int COLS;

        int DEPTH;

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
    
    private:
        void initBoard();
        void printBoard();

        bool isValidMove(int col);
        void makeMove(int col, int player);
        void undoMove(int col);

        //check if player won after move
        bool isWinningMove(int col, int player);

        //returns array of possible moves in 1 turn
        std::vector<int> getPossibleMoves();

        //recursive search of game tree where every node is a different board position coming from a previous node
        Result minimax(int depth, int alpha, int beta, bool maximizing);
        //evaluates current board position
        int currentEval();

    public:
        Game(std::vector<std::vector<int>> _board, std::vector<int> _height, int _depth);

        //returns best move and its evaluation
        Result bestMove(int depth, bool maximizing);
};
#endif