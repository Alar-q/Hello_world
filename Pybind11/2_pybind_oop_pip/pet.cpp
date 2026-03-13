#include <pybind11/pybind11.h>
namespace py = pybind11;

#include <iostream>
#include <string>


class Pet {
protected:
    std::string name;
    int age;
public:
    Pet(const std::string &name) : name(name) { }

    void setName(const std::string &name_) { name = name_; }
    const std::string& getName() const { return name; }

    void setAge(int age_) { age = age_; }
    const int& getAge() const { return age; }

    void set(int age_){ age = age_; } // p.age = 0
    void set(const std::string &name_){ name = name_; } // p.name = ""
};


class Dog : public Pet {
public:
    Dog(const std::string &name) : Pet(name) { }
    std::string bark() const { return "woof!"; }
};


void bind_pet(py::module_& m) {
    // --- Parent superclass ---
    py::class_<Pet> pet(m, "Pet"); // , py::dynamic_attr()
    pet
        // --- Constructor ---
        .def(py::init<const std::string &>())

        // --- Methods ---
        .def("setName", &Pet::setName)
        .def("getName", &Pet::getName)

        // --- Overloading ---
        // .def("set", static_cast<void (Pet::*)(int)>(&Pet::set), "Set the pet's age")
        // .def("set", static_cast<void (Pet::*)(const std::string &)>(&Pet::set), "Set the pet's name")
        .def("set", py::overload_cast<int>(&Pet::set))
        .def("set", py::overload_cast<const std::string&>(&Pet::set))

        // --- print(p) ---
        .def("__repr__",
            [](const Pet &a) {
                return "<mymodule.Pet named '" + a.getName() + "'>";
            }
        )

        // --- Fields ---
        // Public field (direct access):
        //      .def_readwrite("name", &Pet::name); // def_readonly for const fields
        // Private field (Python property through getter/setter):
        .def_property("name", &Pet::getName, &Pet::setName)
        .def_property("age", &Pet::getAge, &Pet::setAge);
        // For read only data
        //      .def_property_readonly("name", &Pet::getName);
        // For write only data pass nullptr as read function
        //      .def_property("name", nullptr, &Pet::setName);
        // ?
        // def_readwrite_static(), def_readonly_static(), def_property_static(), and def_property_readonly_static()
        // smart_holder
        // def_static

    // --- Inheritance ---
    py::class_<Dog> dog(m, "Dog", pet /* <- specify Python parent type */);
    dog
        .def(py::init<const std::string &>())
        .def("bark", &Dog::bark);
}
