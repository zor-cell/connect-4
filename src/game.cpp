#include "game.hpp"

Game::Game(std::vector<std::vector<int>> _board, std::vector<int> _height, std::vector<int> _moves) : board(_board), height(_height), transpositionTable(1000000) {
    srand(time(NULL));

    transpositionTable.print();

    ROWS = board.size();
    COLS = board[0].size();

    bitboard.resize(2, 0);
    heightBit.resize(7);
    for(int i = 0;i < 7;i++) {
        heightBit[i] = i * 7;
    }

    movesBit.resize(42);
    for(int i = 0;i < _moves.size();i++) {
        movesBit[i] = _moves[i];
    }

    for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            if(board[i][j] != 0) {
                moves++;
                counterBit++;
                heightBit[j]++;

                if(board[i][j] == 1) {
                    bitboard[0] ^= (1LL << (5 + j * 7 - i));
                } else if(board[i][j] == 2) {
                    bitboard[1] ^= (1LL << (5 + j * 7 - i));
                }
            }
        }
    }

    for(int i = 0;i < 2;i++) {
        std::bitset<64> a(bitboard[i]);
        std::cout << "BOARD " << i << ": " << a << std::endl;
    }

    std::cout << "COUNTER: " << counterBit << std::endl;
    std::cout << "PLAYER: " << (counterBit & 1) << std::endl;

    std::cout << "HEIGHT: ";
    for(int i : heightBit) {
        std::cout << i << " ";
    }
    std::cout << std::endl;

    std::cout << "MOVES: ";
    for(int i : movesBit) {
        std::cout << i << " ";
    }
    std::cout << std::endl;

    /*for(auto i : table) {
        for(auto j : i) {
            std::cout << j << " ";
        }
        std::cout << "\n";
    }*/

    //printBoard();
}

void Game::initBoard() {
    board.resize(ROWS, std::vector<int>(COLS, 0));
    height.resize(COLS, 0);
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

Result Game::bestMove(int depth, bool maximizing) {
    //std::cout << "Total Moves: " << moves << ", Depth: " << depth << ", Player: " << 1 + moves % 2 << ", Maximizing: " << maximizing << "\n";

    Result res = minimax(depth, INFINITY_NEG, INFINITY_POS, maximizing);
    std::cout << "RESULTING SCORE: " << res.score << std::endl;

    return res;
}

Result Game::minimax(int depth, int alpha, int beta, bool maximizing) {
    //check for draw
    if(counterBit == ROWS * COLS) return {-1, 0};

    if(depth == 0) {
        //move is invalid because it is set in if branches
        return {-2, 0};
    }

    //return move if position was already evaluated
    /*long long int hash = bitboard[0] ^ bitboard[1];
    Entry stored = transpositionTable.get(hash);
    if(stored.depth != -1) {
        if(stored.depth >= depth) {
            //std::cout << "TRANS: " << stored.value.move << " " << stored.value.score << std::endl;
            return stored.value;
        }
    }*/

    int currentBoard = counterBit % 2;

    if(maximizing) {
        Result best = {-3, INFINITY_NEG};

        //go through possible moves
        for(int move : moveOrder) {
            if(isValidMoveBit(move)) {
                //update board with move
                makeMoveBit(move, currentBoard);

                //return best achievable score if win is possible
                if(isWinBit(bitboard[currentBoard])) {
                    int score = 42 - counterBit;
                    undoMoveBit(currentBoard);
                    return {move, score};
                }

                //run algorithm on board with current move played
                Result current = minimax(depth - 1, alpha, beta, false);
                current.move = move;

                //reset board to try every move
                undoMoveBit(currentBoard);

                //update best move and score if better is found
                if(current.score > best.score) {
                    best = current;
                }

                //alpha beta pruning
                alpha = std::max(alpha, current.score);
                if(beta <= alpha) break;
            }
        }

        //insert position in transposition table
        //transpositionTable.set(hash, best, depth);

        return best;
    } else {
        Result best = {-4, INFINITY_POS};

        for(int move : moveOrder) {
            if(isValidMoveBit(move)) {
                makeMoveBit(move, currentBoard);

                if(isWinBit(bitboard[currentBoard])) {
                    int score = -(42 - counterBit);
                    undoMoveBit(currentBoard);
                    return {move, score};
                }

                Result current = minimax(depth - 1, alpha, beta, true);
                current.move = move;

                undoMoveBit(currentBoard);

                if(current.score < best.score) {
                    best = current;
                }

                beta = std::min(beta, current.score);
                if(beta <= alpha) break;
            }
        }

        //insert position in transposition table
        //transpositionTable.set(hash, best, depth);

        return best;
    }
}

bool Game::isDraw() {
    for(int i = 0;i < COLS;i++) {
        if(height[i] < ROWS) return false;
    }

    return true;
}

int Game::currentEval() {
    int score = 0;

    //if(isWinningPosition(1)) return INFINITY_POS;
    //else if(isWinningPosition(2)) return INFINITY_NEG;

    /*for(int i = 0;i < ROWS;i++) {
        for(int j = 0;j < COLS;j++) {
            if(board[i][j] == 1) score += heatMap[i][j];
            if(board[i][j] == 2) score -= heatMap[i][j];
        }
    }*/

    return score;
}

bool Game::isValidMove(int col) {
    return height[col] < ROWS;
}

void Game::makeMove(int col, int player) {
    board[ROWS - 1 - height[col]][col] = player;
    height[col]++;

    moves++;
}

void Game::undoMove(int col) {
    //row is top stone in column
    int row = ROWS - height[col];

    //emtpy current cell
    board[row][col] = 0;

    //remove stone from col
    height[col]--;

    moves--;
}

bool Game::isWinningPosition(int player) {
    //row is one cell above top stone in column
    //int row = ROWS - 1 - height[col];

    //layout for looping over whole board
    int count;
    for(int i = 0; i < ROWS; i++) {
        for(int j = 0; j < COLS; j++) {
            //HORIZONTAL
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(j - k >= 0 && board[i][j - k] == player) count++;
                else break;
            }
            if(count >= 4) return true;

            //VERTICAL
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(i - k >= 0 && board[i - k][j] == player) count++;
                else break;
            }
            if(count >= 4) return true;

            //DIAGONAL LEFT
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(i - k >= 0 && j - k >= 0 && board[i - k][j - k] == player) count++;
                else break;
            }
            if(count >= 4) return true;

            //DIAGONAL RIGHT
            count = 0;
            for(int k = 0; k < 4; k++) {
                if(i + k < ROWS && j - k >= 0 && board[i + k][j - k] == player) count++;
                else break;
            }
            if(count >= 4) return true;
        }
    }

    return false;


    //layout for not looping over whole board
    //VERTICAL
    /*int count = 0;
    if(height[col] >= 3) {
        for(int i = 1;i <= 3;i++) {
            if(board[row + i][col] == player) count++;
            else break;
        }
    }
    if(count >= 3) return true;

    //HORIZONTAL
    count = 0;
    for(int j = 0;j < 4;j++) {

    }*/
}


//bitboard
void Game::makeMoveBit(int col, int currentBoard) {
    long long int move = 1LL << heightBit[col]++;
    bitboard[currentBoard] ^= move;
    movesBit[counterBit++] = col;
}

void Game::undoMoveBit(int currentBoard) {
    int col = movesBit[--counterBit];
    long long int move = 1LL << --heightBit[col];
    bitboard[currentBoard] ^= move;
}

bool Game::isWinBit(long long int board) {
    std::vector<int> directions{1, 7, 6, 8};

    for(int dir : directions) {
        if(((board & (board >> dir)) & (board >> (2 * dir)) & (board >> (3 * dir))) != 0) {
            return true;
        }
    }

    return false;
}

bool Game::isValidMoveBit(int col) {
    if((TOP & (1LL << height[col])) == 0) return true;

    return false;
}

bool Game::isDrawBit() {
    if((__builtin_popcount(bitboard[0] & bitboard[1]) ^ FULL) == 0) return true;

    return false;
}