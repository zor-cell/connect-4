#ifndef H_TRANSPOSITION_HPP
#define H_TRANSPOSITION_HPP

#include "stdafx.hpp"

struct Result {
    int move;
    int score;
};

struct Entry {
    long long int key;
    Result value;
    int depth;
};

class Transposition {
    private:
        std::vector<std::vector<int>> zobristTable;
        std::vector<Entry> entries;

    private:
        int index(long long int key);

        void initZobristTable();

    public:
        Transposition();
        Transposition(int size);

        Entry get(long long int key);
        void set(long long int key, const Result value, int depth);

        int hashBoard(const std::vector<std::vector<int>>& board);

        void print();

};

#endif