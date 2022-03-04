const viewRole = `SELECT role.id, role.title, role.salary, department.name
                AS department_name
                FROM role
                LEFT JOIN department
                ON role.department_id = department.id`;

const roles = `SELECT * FROM role`;

const addRole = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

const deleteRole = `DELETE FROM role WHERE id = ?`;

module.exports = [ viewRole, roles, addRole, deleteRole ];