## 1.tdengine docker创建
```cmd
docker run -d --name tdengine3220_test -p 26030:6030 -p 26035:6035 -p 26041:6041 tdengine/tdengine:3.2.2.0
```
## 1.修改root密码、
```sql
ALTER USER root PASS 'NEW PASSWORD';
```
