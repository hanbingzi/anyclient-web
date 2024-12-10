CREATE PROCEDURE InsertEmployee(IN pFirstName VARCHAR(50), IN pLastName VARCHAR(50), IN pHireDate DATE)
BEGIN
GO
    DECLARE v_employee_id INT;

    INSERT INTO employees (first_name, last_name, hire_date)
    VALUES (pFirstName, pLastName, pHireDate);

    SET v_employee_id = LAST_INSERT_ID();

    SELECT v_employee_id AS 'NewEmployeeID';
END;

CREATE PROCEDURE InsertEmployee(IN pFirstName VARCHAR(50), IN pLastName VARCHAR(50), IN pHireDate DATE)
BEGIN
GO
    DECLARE v_employee_id INT;

    INSERT INTO employees (first_name, last_name, hire_date)
    VALUES (pFirstName, pLastName, pHireDate);

    SET v_employee_id = LAST_INSERT_ID();

    SELECT v_employee_id AS 'NewEmployeeID';
END;



insert into sys_user(name,age,sex,address) value('张三',29,'男','山东省济宁市曲阜市防山乡齐王坡');
insert into sys_user(name,age,sex,address) value('李四',20,'男','山东省济宁市曲阜市防山乡程庄');
insert into sys_user(name,age,sex,address) value('王五',21,'男','山东省济宁市曲阜市防山乡宋家村');
insert into sys_user(name,age,sex,address) value('孔娇',17,'女','山东省济宁市曲阜市防山乡纪庄');

