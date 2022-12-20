SRC = ./src
TARGET = .
FILES = $(SRC)/main.cpp $(SRC)/game.cpp

GCC = g++
CFLAGS = -o $(TARGET)/main
ARGS = 101

EMSCRIPTEN = ./dir/emsdk
EMFLAGS = -o main.js -Oz -s MODULARIZE=1 -s EXPORT_NAME=createModule


all: local

default: main.cpp

local: default test
global: wasm

main.cpp:
	$(GCC) $(CFLAGS) $(FILES)

wasm: 
	./dir/emsdk/em++.exe ../../main.cpp -s WASM=1 -o hello.html

dud:
	$(EMSCRIPTEN)/em++ -I. $(EMFLAGS) --bind $(SRC)/game.cpp $(SRC)/bindings.cpp


test: main.cpp
	$(TARGET)/main $(ARGS)

