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
            case "View All Employees": // Made Function
                viewAllEmployees();
                break;
            case "View All Roles": // Made Function
                viewAllRoles();
                break;
            case "View All Departments": // Made Function
                viewAllDepartments();
                break; 
            case "Add Employee": // Made Function
                addEmployee();
                break;
            case "Add Department": //Made function
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

//Now time for all da functions:

function viewAllEmployees() {
connection.query(
    `select employee.id, employee.first_name, employee.last_name, role.title, department.deptName AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    from employee
    left join role on employee.role_id = role.id
    left join department on role.dept_id = department.id
    left join employee manager on manager.id = employee.manager_id`, (err, res) => {
        if (err) throw err;
        consoleTable.table(res);
        runSearch();
    });
}

// VIEW ALL DEPARTMENTS
function viewAllDepartments(){
    connection.query(
        `select *
        from department;`, (err,res) => {
            if (err) throw err;
            consoleTable(res);
            runSearch();
        });
}

// VIEW ROLES
function viewAllRoles(){
    connection.query(
        `select *
        from role;`, (err, res) =>{
            if(err) throw err;
            consoleTable.table(res);
            runSearch();
        });
}

// ADD EMPLOYEE
function addEmployee() {
    const query1 = `select title from role`;
    connection.query(query1, (err,res) => {
        if (err) throw err;
        let choices = res.map(item => { return item.title });
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What the S is First Name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What the S is last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What role do you speak of?",
                choices: choices
            }
        ]).then(data => {
            const firstName = data.firstName;
            const lastName = data.lastName;
            
            const query2 = `select id from role where title = "${data.role}";`;
            connection.query(query2, (err,res) => {
                if (err) throw err;
                const saveID = res[0].id;
                const query3 = "select concat(first_name, ' ', last_name) AS name from employee;";
                connection.query(query3, (err,res) => {
                    if (err) throw err;
                    let choices = res.map(item => { return item });
                    choices.push({ name: "None" });
                    inquirer.prompt([{
                        name: "assignManager",
                        type: "list",
                        message: "IS this hound a manager?",
                        chocies: choices
                    }]).then(data => {
                        if(data.assignManager === "None") {
                            connection.query(`insert into employee (first_name, last_name, role_id) VALUES ("${firstName}", "${lastName}", ${saveID});`, (err,res) =>{
                                if (err) throw err;
                                runSearch();
                            })
                        } else {
                            const query4 = `select if from employee where concat(fist_name, ' ', last_name) = "${data.assignManager}";`;
                            connection.query(query4, (err,res) => {
                                if (err) throw err;
                                connection.query(`insert into employee (first_name, last_name, role_id, manager_id) values ("${firstName}", "${lastName}", ${saveId}, ${res[0].id});`, (err,res) =>{
                                    if (err) throw err;
                                    consoleTable.table(res);
                                    runSearch();
                                })
                            })
                        }
                    })
                })
            })
        })
    })
}

//ADD DEPARTMENT
function addDepartment(){
    inquirer.prompt({
        name: "departmentName",
        type: "input",
        message: "What is the name of this new department?"

    }).then(data => {
        connection.query(
            `insert into department(departmentName)
            values (?);`, [data.departmentName], (err,res) =>{
                if (err) throw err;
                consoleTable.table(res);
            });
    });
}

//ADD ROLES
// function addRole(){
//     inquirer.prompt([
//         {
//             name:"role",
//             type:"input",
//             message:"Enter the New role name:"
//         },
//         {
//             name:"salary",
//             type:"int",
//             message:"What is the Salary of this role"
//         },
//         {
//             name:"department",
//             type:"list",
//             message:"Which department does it fo to",
//             choices: allDepartments
//         }
//     ])
// }