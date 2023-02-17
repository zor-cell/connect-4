#include "transposition.hpp"

Transposition::Transposition() {};
Transposition::Transposition(int size) {
    entries.resize(size);

    initZobristTable();
}

void Transposition::print() {
    std::cout << "size: " << entries.size() << ", storage: " << (entries.size() * sizeof(Entry)) / 1000000 << "MB" << std::endl;
}

int Transposition::index(long long int key) {
    return key % entries.size();
}

Entry Transposition::get(long long int key) {
    int i = index(key);

    if(entries[i].key == key) {
        return entries[i];
    }

    return {0, {-1, -1}, -1};
}

void Transposition::set(long long int key, const Result value, int depth) {
    int i = index(key);

    entries[i].key = key;
    entries[i].value = value;
    entries[i].depth = depth;
}

void Transposition::initZobristTable() {
    zobristTable.resize(6 * 7, std::vector<int>(2));

    for(int i = 0;i < zobristTable.size();i++) {
        for(int j = 0;j < zobristTable[0].size();j++) {
            zobristTable[i][j] = rand();
        }
    }
}

int Transposition::hashBoard(const std::vector<std::vector<int>> &board) {
    int hash = 0;

    for(int i = 0;i < board.size();i++) {
        for(int j = 0;j < board[0].size();j++) {
            int player = board[i][j];
            hash ^= zobristTable[i + j][player - 1];
        }
    }

    return hash;
}

