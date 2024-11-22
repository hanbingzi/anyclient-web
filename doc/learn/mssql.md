# mssql
## 创建mssql docker服务
```text
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=password" -p 1433:1433 --name mssql2022  -d mcr.microsoft.com/mssql/server:2022-latest
```
## 测试sql
### 1.创建测试表1：
```sql
CREATE TABLE Class (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    teacher VARCHAR(50),
    room VARCHAR(20)
);

INSERT INTO Class (id, name, teacher, room)
VALUES (1, 'Math', 'Mr. Smith', 'Room 101');

INSERT INTO Class (id, name, teacher, room)
VALUES (2, 'English', 'Ms. Johnson', 'Room 202');

INSERT INTO Class (id, name, teacher, room)
VALUES (3, 'Science', 'Dr. Brown', 'Room 305');

INSERT INTO Class (id, name, teacher, room)
VALUES (4, 'History', 'Mrs. Davis', 'Room 115');

INSERT INTO Class (id, name, teacher, room)
VALUES (5, 'Art', 'Mr. Thompson', 'Room 208');

INSERT INTO Class (id, name, teacher, room)
VALUES (6, '中文', 'Mr. Thompson', 'Room 208');
```
### 2.创建全类型的测试表
```sql

```
### 3.函数
```sql
-- 创建
CREATE FUNCTION dbo.AddNumbers(@number1 INT, @number2 INT)
RETURNS INT
AS
BEGIN
    -- Add the two numbers together.
    DECLARE @result INT = @number1 + @number2;
    -- Return the result.
    RETURN @result;
END;
-- 执行
```
### 存储过程
```sql
-- 创建存储过程
CREATE PROCEDURE dbo.TestProcedure
  AS
BEGIN
    -- Declare a variable to store the current date and time.
    DECLARE @currentTime DATETIME = GETDATE();

    -- Print the current date and time to the console.
    PRINT 'The current date and time is: ' + @currentTime;

    -- Return a value to indicate success.
RETURN 0;
END;
-- 调用
EXEC dbo.TestProcedure;
```
