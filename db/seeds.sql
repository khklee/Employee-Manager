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
    

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Ronald', 'Firbank', 1, NULL),
    ('Virginia', 'Woolf', 2, 1),
    ('Piers', 'Gaveston', 2, 1),
    ('Charles', 'LeRoi', 2, 1),
    ('Katherine', 'Mansfield', 3, NULL),
    ('Dora', 'Carrington', 4, 5),
    ('Edward', 'Bellamy', 4, 5),
    ('Montague', 'Summers', 4, 5),
    ('Octavia', 'Butler', 5, NULL),
    ('Unica', 'Zurn', 6, 9),
    ('James', 'Fraser', 6, 9),
    ('Jack', 'London', 6, 9),
    ('Robert', 'Bruce', 7, NULL),
    ('Peter', 'Greenaway', 8, 13),
    ('Derek', 'Jarman', 8, 13),
    ('Paolo', 'Pasolini', 8, 13),
    ('Heathcote', 'Williams', 8, 13);