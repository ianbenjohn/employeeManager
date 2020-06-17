drop database if exists employee_db;
create database employee_db;
use employee_db;

create table department (
    id int not null auto_increment,
    departmentName varchar(30) not null,
    PRIMARY KEY(id)
);

create table role (
    id int not null auto_increment,
    title varchar(30) not null,
    salary decimal(5),
    department_id int not null,
    PRIMARY KEY (id)
);

create table employee (
    id int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int not null,
    PRIMARY KEY (id),
    foreign key (role_id) 
        references role(id),
    foreign key (manager_id) 
        references employee(id)
);