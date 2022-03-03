const viewDepartment = `SELECT * FROM department;`;

const addDepartment = `INSERT INTO department (name) VALUES (?);`;


module.exports = [ viewDepartment, addDepartment ];