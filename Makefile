SRC = ./src
TARGET = .

GCC = g++
CFLAGS = -o $(TARGET)/main
CFILES = $(SRC)/main.cpp $(SRC)/game.cpp

EMSCRIPTEN = ./dir/emsdk
EMFLAGS = -lembind -o main.js -Oz -s MODULARIZE=1 -s EXPORT_NAME=createModule
EMFILES = $(SRC)/game.cpp $(SRC)/bindings.cpp $(SRC)/transposition.cpp

all: global

local:
	$(GCC) $(CFLAGS) $(CFILES)
	$(TARGET)/main
	
global:
	em++ $(EMFLAGS) $(EMFILES)

debug:
	em++ $(EMFLAGS) -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1 $(EMFILES) 