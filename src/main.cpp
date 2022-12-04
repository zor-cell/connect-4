#include "main.hpp"

Main::Main() {
    std::cout << "RUNNING" << std::endl;
    srand(time(NULL));
}

int Main::run() {
    return rand() % 10;
}