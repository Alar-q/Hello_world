#include <pybind11/pybind11.h>
namespace py = pybind11;

void bind_add(py::module_& m);
void bind_constants(py::module_& m);
void bind_pet(py::module_& m);

PYBIND11_MODULE(mymodule, m) { //, py::mod_gil_not_used()
    // const char* doc
    m.doc() = "mymodule is a pybind11 example plugin"; // optional module docstring

    // m.def("add", &add,
    //     "A function that adds two numbers",
    //     py::arg("i") = 1,
    //     py::arg("j") = 2
    // );

    bind_add(m);
    bind_constants(m);
    bind_pet(m);
}

// int main(){
//     std::cout << "Hello, pybind11!" << std::endl;
// }
