for port in $(seq 6179 6184);
do
mkdir -p ./node-${port}/conf
touch ./node-${port}/conf/redis.conf
cat  << EOF > ./node-${port}/conf/redis.conf
port ${port}
requirepass 123456
bind 127.0.0.1
protected-mode no
daemonize yes
appendonly no
dir ./node-${port}/
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip  127.0.0.1
cluster-announce-port ${port}
cluster-announce-bus-port 1${port}
EOF
done
