insert into department (departmentName) 
values ("Sales"), ("Engineering"), ("Greased up Griller");

insert into role (title, salary, department_id)
values ("Sales Lead", 100000000, 1);

insert into employee (first_name, last_name, role_id, manager_id)
values ("John", "Doe", 1, Null);

insert into employee (first_name, last_name, role_id, manager_id)
values ("Mike", "Chan", 2, 1);
