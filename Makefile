SRC = ./src
TARGET = .

GCC = g++
CFLAGS = -o $(TARGET)/main
CFILES = $(SRC)/main.cpp $(SRC)/game.cpp

EMSCRIPTEN = ./dir/emsdk
EMFLAGS = -lembind -o main.js -Oz
EMFILES = $(SRC)/game.cpp $(SRC)/bindings.cpp

EMFLAGS_OLD = -I. -o main.js -Oz -s MODULARIZE=1 -s EXPORT_NAME=createModule --bind

all: global

local:
	$(GCC) $(CFLAGS) $(CFILES)
	$(TARGET)/main
	
global:
	em++ $(EMFLAGS) $(EMFILES)