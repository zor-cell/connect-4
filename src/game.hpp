#ifndef H_RISK_HPP
#define H_RISK_HPP

#include "stdafx.hpp"

class Game {
    private:
        const int ROWS = 6;
        const int COLS = 7;

        std::vector<std::vector<int>> board;

    public:
        Game();

        initBoard();
        printBoard();

        int run();
};
#endif