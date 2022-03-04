const viewDepartment = `SELECT * FROM department`;

const addDepartment = `INSERT INTO department (name) VALUES (?)`;

const deleteDept = `DELETE FROM department WHERE id = ?`;

const budget = `SELECT employee.department_id AS id, department.name AS department, SUM(salary) AS budget
                FROM employee
                INNER JOIN department 
                ON department.id = employee.department_id
                INNER JOIN role
                ON employee.role_id = role.id
                GROUP BY employee.department_id`;

module.exports = [ viewDepartment, addDepartment, deleteDept, budget ];