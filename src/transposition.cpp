#include "transposition.hpp"

Transposition::Transposition() {};
Transposition::Transposition(int size) {
    entries.resize(size);

    initZobristTable();
}

void Transposition::print() {
    std::cout << "size: " << entries.size() << ", storage: " << (entries.size() * sizeof(Result) + entries.size() * sizeof(int)) / 1000000 << "MB" << std::endl;
}

int Transposition::index(int key) {
    return key % entries.size();
}

Result Transposition::get(int key) {
    int i = index(key);

    if(entries[i].key == key) {
        return entries[i].value;
    }

    return {-1, -1};
}

void Transposition::set(int key, const Result& value) {
    int i = index(key);

    entries[i].key = key;
    entries[i].value = value;
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

