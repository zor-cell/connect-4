#ifndef H_TRANSPOSITION_HPP
#define H_TRANSPOSITION_HPP

#include "stdafx.hpp"

//return type to be passed to javascript
struct Result {
    int move;
    int score;
};

class Transposition {
    private:
        struct Entry {
            int key;
            Result value;
        };

        std::vector<std::vector<int>> zobristTable;
        std::vector<Entry> entries;

    private:
        int index(int key);

        void initZobristTable();

    public:
        Transposition();
        Transposition(int size);

        Result get(int key);
        void set(int key, const Result& value);

        int hashBoard(const std::vector<std::vector<int>>& board);

        void print();

};

#endif