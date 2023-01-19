# Connect 4 Solver
This is my Connect 4 Solver, which you can play against. It is implemented with C++, then compiled with WebAssembly to be run in the browser with React.js.

## Important commands
Each of the following commands is assumed to be run in the main directory.

This project is managed with a Makefile, so compiling the code doesn't require multiple individual commands. To build the project this file path needs to be used:
    dir\MINGW\bin\make.exe all

### Compile CPP files locally
    dir\MINGW\bin\make.exe local

### Compile WASM file
    dir\MINGW\bin\make.exe global

### Run files on local server
python -m http.server
