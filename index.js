const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const [ viewDepartment, addDepartment ] = require('./lib/department');
const [ viewRole, addRole ] = require('./lib/role');
const [ viewEmployee, addEmployee ] = require('./lib/employee');

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
        if (err) throw (err);
        console.table(rows);
        return questions();
    });
};

// Show all roles
const showRole = () => {
    db.query(viewRole, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        return questions();
    });
};

// Show all employees
const showEmployee = () => {
    db.query(viewEmployee, (err, rows) => {
        if (err) throw (err);
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
            if (err) throw (err);
            console.log(answer.department + ` department created!`);
            return questions();
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
        },
        {
            type: 'input',
            name: 'id',
            message: 'What is the department id?',
        }
    ])
    .then((answer) => {
        let roleInfo = [answer.title, answer.salary, answer.id]
        db.query(addRole, roleInfo, (err, rows) => {
            if (err) throw (err);
            console.log(answer.title + ` role created!`);
            return questions();
        });
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
    },
    {
        type: 'input',
        name: 'roleId',
        message: 'What is the role id?',
    },
    {
        type: 'input',
        name: 'managerId',
        message: 'What is the manager id?',
    }
])
.then((answer) => {
    let employeeInfo = [answer.firstName, answer.lastName, answer.roleId, answer.managerId]
    db.query(addEmployee, employeeInfo, (err, rows) => {
        if (err) throw (err);
        console.log('New employee created!');
        return questions();
    });
})

};


questions();
