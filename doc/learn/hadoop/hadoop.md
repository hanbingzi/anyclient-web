# Hadoop

## 测试数据
1. 创建表格
```hiveql
CREATE TABLE example_table (
  id INT,
  name STRING,
  age INT,
  salary DOUBLE,
  is_employed BOOLEAN,
  birth_date DATE,
  address STRUCT<street:STRING, city:STRING, state:STRING>,
  hobbies ARRAY<STRING>,
  properties MAP<STRING, STRING>
)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ','
COLLECTION ITEMS TERMINATED BY ','
MAP KEYS TERMINATED BY ':'
STORED AS TEXTFILE;
```
2. 插入数据
```hiveql
INSERT INTO example_table VALUES (
  1,
  'John',
  25,
  50000.0,
  true,
  '1990-01-01',
  named_struct('street', '123 Main St', 'city', 'New York', 'state', 'NY'),
  array('reading', 'gaming'),
  map('key1', 'value1', 'key2', 'value2')
);

INSERT INTO example_table VALUES (
  2,
  'Alice',
  30,
  60000.0,
  false,
  '1985-05-10',
  named_struct('street', '456 Elm St', 'city', 'San Francisco', 'state', 'CA'),
  array('hiking', 'painting'),
  map('key3', 'value3', 'key4', 'value4')
);

INSERT INTO example_table VALUES (
  3,
  'Bob',
  40,
  70000.0,
  true,
  '1981-09-15',
  named_struct('street', '789 Oak St', 'city', 'Chicago', 'state', 'IL'),
  array('cooking', 'photography'),
  map('key5', 'value5', 'key6', 'value6')
);
```

## Hive 是一个基于 Hadoop 的数据仓库工具，提供了类似于 SQL 的查询语言，称为 HiveQL。下面是一些常用的 Hive 命令：

1. 创建数据库：
```sql
CREATE DATABASE database_name;
```

2. 使用数据库：
```sql
USE database_name;
```

3. 创建表：
```sql
CREATE TABLE table_name (
  column1_name data_type,
  column2_name data_type,
  ...
);
```

4. 查看表结构：
```sql
DESCRIBE table_name;
```

5. 加载数据到表中：
```sql
LOAD DATA INPATH 'hdfs_path' INTO TABLE table_name;
```

6. 查询表数据：
```sql
SELECT * FROM table_name;
```

7. 条件查询：
```sql
SELECT * FROM table_name WHERE condition;
```

8. 聚合函数查询：
```sql
SELECT function(column) FROM table_name;
```

9. 分组查询：
```sql
SELECT column, function(column) FROM table_name GROUP BY column;
```

10. 排序查询：
```sql
SELECT * FROM table_name ORDER BY column;
```

11. 连接查询：
```sql
SELECT * FROM table1 JOIN table2 ON table1.column = table2.column;
```

12. 创建视图：
```sql
CREATE VIEW view_name AS SELECT * FROM table_name;
```

13. 插入数据到表中：
```sql
INSERT INTO table_name VALUES (value1, value2, ...);
```

14. 更新表数据：
```sql
UPDATE table_name SET column = value WHERE condition;
```

15. 删除表数据：
```sql
DELETE FROM table_name WHERE condition;
```

这些是 Hive 中的一些常见命令示例。Hive 还支持更多的命令和功能，例如分区表、动态分区、存储格式设置等。你可以根据具体需求查阅 Hive 的官方文档以获取更详细的命令和语法说明。
## 搭建
参考网址：https://blog.csdn.net/m0_74298808/article/details/136387525
