

TARGET := mymodule$(shell python3-config --extension-suffix)

INCLUDES = -Ipybind11/include $(shell python3-config --includes)


all: clean submodules run

submodules:
	git submodule update --init --recursive --progress
	cmake -S pybind11 -B pybind11/build
	cd pybind11/build && make check -j$(shell nproc)

build:
	g++ mymodule.cpp -O3 -Wall -shared -std=c++20 -fPIC -o $(TARGET) $(INCLUDES)

run: build
	python3 main.py

clean:
	rm -rf pybind11/build
	rm -f $(TARGET)
