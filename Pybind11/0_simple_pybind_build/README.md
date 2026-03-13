# Building from source

---

#### Include Pybind11 as a submodule

https://pybind11.readthedocs.io/en/stable/installing.html#include-as-a-submodule
```sh
git submodule add -b stable git@github.com:pybind/pybind11.git
git submodule update --init --recursive --progress
```

---

#### Compile Pybind11

Compile and run with tests:
https://pybind11.readthedocs.io/en/stable/compiling.html#building-manually
```sh
cmake -S pybind11 -B pybind11/build

cd pybind11/build
make check -j$(nproc)
cd ../../
```

---

#### Build Shared Library

Shared library (custom.so):
```sh
g++ mymodule.cpp -O3 -Wall -shared -fPIC -std=c++20 \
-o mymodule$(python3-config --extension-suffix) \
-Ipybind11/include \
$(python3-config --includes)
```
- `-O3` - optimization
- `-Wall` - warnings
- `-std=c++20` - c++ standard

Generates: `mymodule.cpython-311-x86_64-linux-gnu.so`.

Include paths for headers of:
- Pybind11: `-Ipybind11/include`
- Python: `python3-config --includes`
	- `-I/usr/include/python3.11 `
	- `-I/usr/include/python3.11`

---

#### Run Python

Run:
```sh
python3 main.py
```

