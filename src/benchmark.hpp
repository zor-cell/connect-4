#ifndef H_BENCHMARK_HPP
#define H_BENCHMARK_HPP

#include "stdafx.hpp"

#include <chrono>

namespace Benchmark {
    inline int nodesVisited = 0;

    inline void save();
}

void Benchmark::save() {
    std::cout << "Nodes: " << nodesVisited << "\n";
}

#endif