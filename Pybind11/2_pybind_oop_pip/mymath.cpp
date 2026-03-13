#include <pybind11/pybind11.h>
namespace py = pybind11;

#include <iostream>

int add(int i, int j) {
    std::cout << "i=" << i << ", j=" << j << std::endl;
    return i + j;
}

void bind_add(py::module_& m) {
    m.def("add", &add,
        py::arg("i") = 1,
        py::arg("j") = 2,
        "A function that adds two numbers"
    );
}
