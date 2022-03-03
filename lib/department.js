const department = `SELECT * FROM department;`

const role = ` SELECT role.id, role.title, role.salary, department.name
                    AS department_name
                    FROM role
                    LEFT JOIN department
                    ON role.department_id = department.id`;

const employee = ` SELECT e.id, e.first_name, e.last_name, department.name AS department_name, role.title, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
                        FROM employee e
                        LEFT JOIN employee m
                        ON e.manager_id = m.id
                        INNER JOIN role
                        ON e.role_id = role.id
                        INNER JOIN department
                        ON role.department_id = department.id`; 

module.exports = [ department, role, employee ];