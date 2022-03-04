INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 120000, 1),
    ('Salesperson', 80000, 1),
    ('Engineer Manager', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant Manager', 150000, 3),
    ('Accountant', 120000, 3),
    ('Legal Manager', 200000, 4),
    ('Lawyer', 160000, 4);
    

INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id)
VALUES 
    ('Ronald', 'Firbank', 1, NULL, 1),
    ('Virginia', 'Woolf', 2, 1, 1),
    ('Piers', 'Gaveston', 2, 1, 1),
    ('Charles', 'LeRoi', 2, 1, 1),
    ('Katherine', 'Mansfield', 3, NULL, 2),
    ('Dora', 'Carrington', 4, 5, 2),
    ('Edward', 'Bellamy', 4, 5, 2),
    ('Montague', 'Summers', 4, 5, 2),
    ('Octavia', 'Butler', 5, NULL, 3),
    ('Unica', 'Zurn', 6, 9, 3),
    ('James', 'Fraser', 6, 9, 3),
    ('Jack', 'London', 6, 9, 3),
    ('Robert', 'Bruce', 7, NULL, 4),
    ('Peter', 'Greenaway', 8, 13, 4),
    ('Derek', 'Jarman', 8, 13, 4),
    ('Paolo', 'Pasolini', 8, 13, 4);