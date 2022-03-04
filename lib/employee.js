const viewEmployee = `SELECT e.id, e.first_name, e.last_name, department.name AS department_name, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                    FROM employee e
                    LEFT JOIN employee m
                    ON e.manager_id = m.id
                    INNER JOIN role
                    ON e.role_id = role.id
                    INNER JOIN department
                    ON role.department_id = department.id`;
const viewByManager = `SELECT e.id, e.first_name, e.last_name, department.name AS department_name, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                    FROM employee e
                    LEFT JOIN employee m
                    ON e.manager_id = m.id
                    INNER JOIN role
                    ON e.role_id = role.id
                    INNER JOIN department
                    ON role.department_id = department.id
                    ORDER BY e.manager_id`;

const viewByDepartment = `SELECT e.id, e.first_name, e.last_name, department.name AS department_name, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                        FROM employee e
                        LEFT JOIN employee m
                        ON e.manager_id = m.id
                        INNER JOIN role
                        ON e.role_id = role.id
                        INNER JOIN department
                        ON role.department_id = department.id
                        ORDER BY department.id`;

const addEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

const getManagerId = `SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL`;

const getAllEmployee = `SELECT * FROM employee`

const getExceptManager = `SELECT * FROM employee WHERE manager_id IS NOT NULL`;

const addNewRole = `UPDATE employee SET role_id = ? WHERE id = ?`;

const addNewManager = `UPDATE employee SET manager_id = ? WHERE id = ?`;

const deleteEmployee = `DELETE FROM employee WHERE id = ?`;

module.exports = [ viewEmployee, viewByManager, viewByDepartment, addEmployee, getManagerId, getAllEmployee, getExceptManager, addNewRole, addNewManager, deleteEmployee ];