const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const [ viewDepartment, addDepartment ] = require('./lib/department');
const [ viewRole, addRole ] = require('./lib/role');
const [ viewEmployee, addEmployee, getManagerId, getName, addNewRole ] = require('./lib/employee');

// Create an array of questions for user input
const questions = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all department', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Finish']
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
        if (options === 'Finish') {
            console.log('You finished managing your organization!');
            db.end();
        }
    })
};

// Show all department
const showDepartment = () => {
    db.query(viewDepartment, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        return questions();
    });
};

// Show all roles
const showRole = () => {
    db.query(viewRole, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        return questions();
    });
};

// Show all employees
const showEmployee = () => {
    db.query(viewEmployee, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        return questions();
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
    })

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
                    message: 'What is the department id?',
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
                })
            })
        })
    })  
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
        let params = [input.firstName, input.lastName];

        // Get a role id
        db.query(viewRole, (err, data) => {
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
                    const ids = data.map(({ first_name, last_name, role_id }) => ({ name: first_name + ' ' + last_name, value: role_id }));

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

                        // Add a new employee to the employee table
                        db.query(addEmployee, params, (err, row) => {
                            if (err) throw err;
                            console.log('New employee created!');
                            showEmployee();
                        });
                    })
                })
            })
        })
    })
};

// Update an employee role
const updateEmployeeRole = () => {
    // Get employees
    db.query(getName, (err, data) => {
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

                    params [0]= newRole;
                    params [1] = employeeName;

                    console.log(params);

                    // Add a new employee's role to the employee table
                    db.query(addNewRole, params, (err, row) => {
                        if (err) throw err;
                        console.log('Updated a new role for the employee!');
                        showEmployee();
                    })

                })
            })
        })
    });
    


}

questions();
