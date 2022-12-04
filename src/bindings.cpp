#include <emscripten/bind.h>
#include "main.hpp"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(main) {
   class_<Main>("Main")
   .constructor<>()
   .function("run", &Main::run)
   ;
}