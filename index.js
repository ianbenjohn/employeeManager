const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_db"
});

connection.connect(err => {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer.prompt({
        name: "start",
        type: "list",
        message: "What would you fancy?",
        choices: [
            "View All Employees",
            "View All Roles",
            "View All Departments",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            "exit"
        ]
    }).then(answer => {
        switch(answer.start){
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Departments":
                viewAllDepartments();
                break; 
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "exit":
                connection.end();
                break;
            default:
                console.log("great job choosing a correct choice! (sarcasm)");
                connection.end();
                break;
        }
    });
}