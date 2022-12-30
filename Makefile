SRC = ./src
TARGET = .

GCC = g++
CFLAGS = -o $(TARGET)/main
CFILES = $(SRC)/main.cpp $(SRC)/game.cpp

EMSCRIPTEN = ./dir/emsdk
EMFLAGS = -I. -o main.js -Oz -s MODULARIZE=1 -s EXPORT_NAME=createModule --bind
EMFILES = $(SRC)/game.cpp $(SRC)/bindings.cpp



all: global

local: main
global: wasm

main:
	$(GCC) $(CFLAGS) $(CFILES)
	$(TARGET)/main

wasm: 
	em++ $(EMFLAGS) $(EMFILES)

dud:
	$(EMSCRIPTEN)/em++ -I. $(EMFLAGS) --bind $(SRC)/game.cpp $(SRC)/bindings.cpp