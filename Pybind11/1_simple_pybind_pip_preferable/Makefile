
TARGET := mymodule$(shell python3-config --extension-suffix)

PIP = .venv/bin/pip
PYTHON = .venv/bin/python
INCLUDES = $(shell $(PYTHON) -m pybind11 --includes)

all: clean venv run

venv:
	python3 -m venv .venv
	$(PIP) install --upgrade pip
	$(PIP) install pybind11

build:
	g++ mymodule.cpp -O3 -Wall -shared -std=c++20 -fPIC -o $(TARGET) $(INCLUDES)

run: build
	$(PYTHON) main.py

clean:
	rm -rf .venv/
	rm -f $(TARGET)
