#ifndef H_GAME_HPP
#define H_GAME_HPP

#include "stdafx.hpp"

class Game {
    private:
        const int ROWS = 6;
        const int COLS = 7;

        std::vector<std::vector<int>> board;

    public:
        Game();

        void initBoard();
        void printBoard();

        int run();
};
#endif