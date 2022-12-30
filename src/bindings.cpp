#include <emscripten/bind.h>
#include "game.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(game) {
   class_<Game>("Game")
   .constructor<std::vector<std::vector<int>>, std::vector<int>>()
   .function("bestMove", &Game::bestMove)
   ;

   register_vector<int>("Vector");
   register_vector<std::vector<int>>("Vector2D");
}