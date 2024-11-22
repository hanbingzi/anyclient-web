# redis单机
```shell
docker run -it --name redis-nopwd  -d -p 6079:6379 redis:6
```
# redis 集群搭建

https://juejin.cn/post/6992872034065727525

- 服务器环境集群建立命令
```shell

redis-cli -a oracle123ioporacle123ioporacle123iop --cluster create 111.67.201.184:6179 111.67.201.184:6180 111.67.201.184:6181 111.67.201.184:6182 111.67.201.184:6183 111.67.201.184:6184   --cluster-replicas 1

redis-cli  -a 123456 --cluster create 127.0.0.1:6179 127.0.0.1:6180 127.0.0.1:6181 127.0.0.1:6182 127.0.0.1:6183 127.0.0.1:6184   --cluster-replicas 1

```

- 查看本机ip：ipconfig getifaddr en0

