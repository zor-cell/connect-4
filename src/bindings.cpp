#include <emscripten/bind.h>
#include "game.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(game) {
   class_<Game>("Game")
   .constructor<>()
   .function("run", &Game::run)
   ;
}