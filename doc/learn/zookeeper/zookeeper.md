# linux命令

## 启动相关

1. 启动ZK服务:        sh zkServer.sh start
2. 查看ZK服务状态: sh zkServer.sh status
3. 停止ZK服务:        sh zkServer.sh stop
4. 重启ZK服务:        sh zkServer.sh restart

## 操作相关
- 首先通过命令连接zk：sh zkCli.sh -server ip:port
- 显示根目录下、文件： ls / 使用 ls 命令来查看当前 ZooKeeper 中所包含的内容
- 创建文件，并设置初始内容： create /zk "test" 创建一个新的 znode节点“ zk ”以及与它关联的字符串 
- 获取文件内容： get /zk 确认 znode 是否包含我们所创建的字符串
- 修改文件内容： set /zk "zkbak" 对 zk 所关联的字符串进行设置
- 删除文件： delete /zk 将刚才创建的 znode 删除
- 退出客户端： quit
- 帮助命令： help


原文链接：https://blog.csdn.net/king_qc/article/details/81781504
# docker
## 1.启动集群
```
COMPOSE_PROJECT_NAME=zookeeper_cluster docker-compose up -d
```
## 2.参考地址
```
https://cloud.tencent.com/developer/article/1680299
```
