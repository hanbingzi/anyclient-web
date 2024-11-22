# mysql

## docker

### 创建docker

```dockerfile
docker run --name mysql8.2 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=oracle123iop -d mysql:8.2
```

## 创建用户并赋予权限

```text

-- 创建新用户并授予权限，允许从任何远程主机连接
CREATE USER '新用户名'@'%' IDENTIFIED BY '密码';
GRANT ALL PRIVILEGES ON 数据库名.* TO '新用户名'@'%';
FLUSH PRIVILEGES;
```

## 设置root能够访问

1. 启动

```
docker run --name some-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
```

2. mysql8远程解决无法远程访问

```
docker exec -it mysql-name bash
grant all privileges on *.* to 'root'@'%';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
flush privileges;

```

3. mysql5无法访问

```
docker exec -it mysql-name bash
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
flush privileges;
```
