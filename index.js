const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const [ viewDepartment, addDepartment, deleteDept, budget ] = require('./lib/department');
const [ viewRole, roles, addRole, deleteRole ] = require('./lib/role');
const [ viewEmployee, viewByManager, viewByDepartment, addEmployee, getManagerId, getAllEmployee, getExceptManager, addNewRole, addNewManager, deleteEmployee ] = require('./lib/employee');

// Create an array of questions for user input
const questions = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all department', 'View all roles', 'View all employees', 'View employees by manager', 'View employees by department', 'View the total utilized budget of a department', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update employee managers', 'Delete departments', 'Delete roles', 'Delete employees', 'Finish']
        }
    )
    .then(({ options }) => {
        if (options === 'View all department') {
            showDepartment();
        }
        if (options === 'View all roles') {
            showRole();
        }
        if (options === 'View all employees') {
            showEmployee();
        }
        if (options === 'View employees by manager') {
            showByManager();
        }
        if (options === 'View employees by department') {
            showByDepartment();
        }
        if (options === 'View the total utilized budget of a department') {
            viewBudget();
        }
        if (options === 'Add a department') {
            newDepartment();
        }
        if (options === 'Add a role') {
            newRole();
        }
        if (options === 'Add an employee') {
            newEmloyee();
        }
        if (options === 'Update an employee role') {
            updateEmployeeRole();
        }
        if (options === 'Update employee managers') {
            updateManagers();
        }
        if (options === 'Delete departments') {
            deleteDepartments();
        }
        if (options === 'Delete roles') {
            deleteRoles();
        }
        if (options === 'Delete employees') {
            deleteEmployees();
        }
        if (options === 'Finish') {
            console.log('You finished managing your organization!');
            db.end();
        };
    });
};

// Show all department
const showDepartment = () => {
    db.query(viewDepartment, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    });
};

// Show all roles
const showRole = () => {
    db.query(viewRole, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    });
};

// Show all employees
const showEmployee = () => {
    db.query(viewEmployee, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    });
};

// Show employees by manager
const showByManager = () => {
    db.query(viewByManager, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    });
};

// Show employees by department
const showByDepartment = () => {
    db.query(viewByDepartment, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    });
};

// Show the total utilized budget of a department
const viewBudget = () => {
    db.query(budget, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        questions();
    });
};


// Add a department
const newDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of new department?'
        }
    )
    .then((answer) => {
        // Add a new department to the department table
        db.query(addDepartment, answer.department, (err, rows) => {
            if (err) throw err;
            console.log(answer.department + ` department created!`);
            showDepartment();
        });
    });

};

// Add a role
const newRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'How much is the salary?'
        }
    ])
    .then(input => {
        let params = [ input.title, input.salary ];

        // get department ids from department table
        db.query(viewDepartment, (err, data) => {
            if (err) throw err;

            const dept = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt(
                {
                    type: 'list',
                    name: 'id',
                    message: 'What department is this role in?',
                    choices: dept
                }
            )
            .then(choice => {
                const deptId = choice.id;
                params.push(deptId);
                
                // Add a new role to the role table
                db.query(addRole, params, (err, row) => {
                    if (err) throw err;
                    console.log('New role, ' + input.title + ' created!');
                    showRole();
                });
            });
        });
    });  
};

// Add an employee
const newEmloyee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        }
    ])
    .then(input => {
        const firstName = input.firstName;
        const lastName = input.lastName;
        const params = [];
        params.push(firstName, lastName);

        // Get a role id
        db.query(roles, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ title, id }) => ({ name: title, value: id }));

            inquirer.prompt(
                {
                    type: 'list',
                    name: 'roleId',
                    message: "What is the employee's role?",
                    choices: roles
                }
            )
            .then(choice => {
                const role = choice.roleId;
                params.push(role);

                // Get a manager id
                db.query(getManagerId, (err, data) => {
                    if (err) throw err;
                    const ids = data.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));
                    console.log(ids);
                    inquirer.prompt(
                        {
                            type: 'list',
                            name: 'managerName',
                            message: "Who is the employee's manager?",
                            choices: ids
                        }
                    )
                    .then(choice => {
                        const manager = choice.managerName;
                        params.push(manager);
                        console.log(manager);
                        // Add a new employee to the employee table
                        db.query(addEmployee, params, (err, row) => {
                            if (err) throw err;
                            console.log('New employee created!');
                            console.log(params);
                            showEmployee();
                        });
                    });
                });
            });
        });
    });
};

// Update an employee role
const updateEmployeeRole = () => {
    // Get employees
    db.query(getAllEmployee, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                message: "Who would you like to update?",
                choices: employees
            }
        )
        .then(choice => {
            const employeeName = choice.employee;
            const params = [];
            params.push(employeeName);

            // Get a role id
            db.query(viewRole, (err, data) => {
                if (err) throw err;
                const roles = data.map(({ title, id }) => ({ name: title, value: id }));
    
                inquirer.prompt(
                    {
                        type: 'list',
                        name: 'newRole',
                        message: "What is the employee's new role?",
                        choices: roles
                    }
                )
                .then(choice => {
                    const newRole = choice.newRole;
                    params.push(newRole);

                    params [0] = newRole;
                    params [1] = employeeName;

                    console.log(params);

                    // Add a new employee's role to the employee table
                    db.query(addNewRole, params, (err, row) => {
                        if (err) throw err;
                        console.log('Updated a new role for the employee!');
                        showEmployee();
                    });

                });
            });
        });
    });
};

// Update employee's managers
const updateManagers = () => {
    // Get employees
    db.query(getExceptManager, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                message: "Who would you like to update?",
                choices: employees
            }
        )
        .then(choice => {
            const employeeName = choice.employee;
            const params = [];
            params.push(employeeName);

            // Get a manager id
            db.query(getManagerId, (err, data) => {
                if (err) throw err;
                const ids = data.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));
                console.log(ids);
                inquirer.prompt(
                    {
                        type: 'list',
                        name: 'managerName',
                        message: "Who is the employee's new manager?",
                        choices: ids
                    }
                )
                .then(choice => {
                    const manager = choice.managerName;
                    params.push(manager);

                    params[0] = manager;
                    params[1] = employeeName;

                    console.log(params);
                    // Add a new manager to the employee table
                    db.query(addNewManager, params, (err, row) => {
                        if (err) throw err;
                        console.log("Updated the employee's manager!");
                        showEmployee();
                    });
                });
            });
        });
    });
};

// Delete departments
const deleteDepartments = () => {
    // Get department ids
    db.query(viewDepartment, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt(
            {
                type: 'list',
                name: 'id',
                message: 'Which department would you like to delete?',
                choices: dept
            }
        )
        .then(choice => {
            const dept = choice.id;
            // Delete the department from the table
            db.query(deleteDept, dept, (err, row) => {
                if (err) throw err;
                    console.log("Successfuly deleted!");
                    showDepartment();
            });
        });
    });

};

// Delete roles
const deleteRoles = () => {
        // Get a role id
        db.query(viewRole, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ title, id }) => ({ name: title, value: id }));

            inquirer.prompt(
                {
                    type: 'list',
                    name: 'roleId',
                    message: "Which role would you like to delete?",
                    choices: roles
                }
            )
            .then(choice => {
                const role = choice.roleId;

                // Delete the role from the table
                db.query(deleteRole, role, (err, row) => {
                    if (err) throw err;
                        console.log("Successfuly deleted!");
                        showRole();
                });
            });
        });
};

// Delete employees
const deleteEmployees = () => {
    // Get employees
    db.query(getAllEmployee, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));

        inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        )
        .then(choice => {
            const employee = choice.employee;

            // Delete the role from the table
            db.query(deleteEmployee, employee, (err, row) => {
                if (err) throw err;
                    console.log("Successfuly deleted!");
                    showEmployee();
            });
        });
    });
};

questions();
