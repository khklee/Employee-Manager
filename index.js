const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

const [ department, role, employee ] = require('./lib/department')

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
        if (options === 'Finish') {
            console.log('You finished managing your organization!')
        }
    })
};

// Show all department
const showDepartment = () => {
    db.query(department, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        return questions();
    });
};

// Show all roles
const showRole = () => {
    db.query(role, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        return questions();
    });
};

// Show all employees
const showEmployee = () => {
    db.query(employee, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        return questions();
    });
};



questions();
