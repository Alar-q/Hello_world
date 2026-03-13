import mymodule as m

print(m.add(1, 3))
print(m.add(i=1, j=3))
print(m.add(j=4, i=3))
print(m.add())

print(m.answer)

p = m.Pet("Molly")
print(p)
# <mymodule.Pet object at 0x7ff9613128b0>
# __repr__: <mymodule.Pet named 'Molly'>
print(p.getName()) # 'Molly'
p.setName("Charly")
print(p.age)
p.set(123)
print(p.age)
p.set("Kek")
print(p.getName()) # 'Charly'

p.name = "lol"
print(p.name) # 'Charly'


d = m.Dog("Doggy")
print(d.name)
print(d.bark())
