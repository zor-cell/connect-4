#include <emscripten/bind.h>
#include "game.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(game) {
   class_<Game>("Game")
      .constructor<std::vector<std::vector<int>>, std::vector<int>, std::vector<int>>()
      .function("bestMove", &Game::bestMove)
   ;

   //C++ struct to JavaScript Object
   value_object<Result>("Result")
      .field("move", &Result::move)
      .field("score", &Result::score)
   ;

   //JavaScript arrays to C++ vectors
   register_vector<int>("Vector");
   register_vector<std::vector<int>>("Vector2D");
}