# WebAssembly-template
This is a template for my coding Projects using WebAssembly, specifically emscripten. The computations in this template are performed in C++, while the front-end is controlled via JavaScript involving the React.js framework.

## Important commands
### Compile WASM file
/dir/emsdk
em++ -I. -o ../../main.js -Oz -s MODULARIZE=1 -s EXPORT_NAME=createModule --bind ../../src/main.cpp ../../src/bindings.cpp

### Run files on local server
/
python -m http.server
