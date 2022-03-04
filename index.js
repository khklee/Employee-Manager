const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const [ viewDepartment, addDepartment ] = require('./lib/department');
const [ viewRole, addRole ] = require('./lib/role');
const [ viewEmployee, addEmployee, getManagerId ] = require('./lib/employee');

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
        db.query(addDepartment, answer.department, (err, rows) => {
            if (err) throw err;
            console.log(answer.department + ` department created!`);
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
            // let deptArray = [];
            const dept = data.map(({ name, id }) => ({ name: name, value: id }));
            console.log(dept);
            // dept.forEach((dept) => {deptArray.push(dept.name);});
            // console.log(deptArray);

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
                
                console.log(params);
                db.query(addRole, params, (err, result) => {
                    if (err) throw err;
                    console.log('New role, ' + input.title + ' created!');
                    return questions();
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
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?'
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
                    message: 'What is the role id?',
                    choices: roles
                }
            )
            .then(choice => {
                const role = choice.roleId;
                params.push(role);
                console.log(params);

                // Get a manager id
                db.query(getManagerId, (err, data) => {
                    if (err) throw err;
                    const ids = data.map(({ first_name, last_name, role_id }) => ({ name: first_name + ' ' + last_name, value: role_id }));
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

                        db.query(addEmployee, params, (err, rows) => {
                            if (err) throw err;
                            console.log('New employee created!');
                            return questions();
                        });
                    })
                })
            })
        })
    })

    // {
    //     type: 'input',
    //     name: 'managerId',
    //     message: 'What is the manager id?',
    // }

// .then((answer) => {
//     let employeeInfo = [answer.firstName, answer.lastName, answer.roleId, answer.managerId]
//     db.query(addEmployee, employeeInfo, (err, rows) => {
//         if (err) throw (err);
//         console.log('New employee created!');
//         return questions();
//     });
// })

};


questions();
