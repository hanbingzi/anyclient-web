export {}
// import { RPCService } from '@opensumi/ide-connection';
// import { Injectable } from '@opensumi/di';
//
// @Injectable()
// export class KafkaRpcClient extends RPCService {
//
//   showMessage = (message: string) => {
//     // 这里的 this.rpcClient![0] 可以直接获取到通信通道下的 proxy 实例
//     console.log('KafkaRpcClient -node', message);
//     let i = 0;
//      setInterval(() => {
//       i++;
//       this.rpcClient![0].onMessage(`I got you message, echo again. ${message}-${i}`);
//     }, 1000);
//
//   };
//
//   async queryNewData(connect:ConnectQuery, topic: string, queryPartition: string, size: number, queryStart: IQueryStart): Promise<IQueryResult> {
//     const kafka = await this.getClient(connect)
//     const partitionOffsetInfos = await this.getOffset(connect, topic);
//     const consumer = kafka.consumer({groupId: this.getGroupId(connect.server)})
//     // const partitionLength = partitionOffsetInfo.length;
//     const seekParams: { partition: number, offset: number }[] = []
//     const partitionQuerySize: { [key: string]: number } = {};
//     let allSize: number = 0;
//     //构建查询条件
//     for (let partitionOffset of partitionOffsetInfos) {
//       const {partition, offset, high, low} = partitionOffset;
//       if (isEmpty(queryPartition) || Number(queryPartition) === partition) {
//         const hasMessageSize = Number(high) - Number(low);
//         const seekOffset: number = queryStart === "Newest" ? Math.max(hasMessageSize - size, 0) : Number(low);
//         seekParams.push({partition: partition, offset: seekOffset})
//         const querySize = size > hasMessageSize ? hasMessageSize : size;
//         partitionQuerySize[`${partition}`] = querySize;
//         allSize = allSize + querySize;
//       }
//     }
//     if (allSize === 0) {
//       return {success: true, data: []}
//     }
//     // dataLength % partitionLength
//     // Producing
//     // Consuming
//     await consumer.connect()
//     await consumer.subscribe({topic})
//     let data: IMessage[] = [];
//     return new Promise<IQueryResult<IMessage[]>>((resolve, reject) => {
//       //设置过期时间
//       const timer = setTimeout(() => {
//         console.log("拿取数据超时setTimeout");
//         consumer.disconnect();
//         resolve({success: false, data, error: "拿取数据超时"});
//       }, 1000 * 120)//两分钟超时
//       consumer.run({
//         eachMessage: async ({topic, partition, message}) => {
//           const currentPartitionIndex = partitionQuerySize[`${partition}`];
//           if (currentPartitionIndex > 0) {
//             data.push({
//               partition,
//               key: message.key ? message.key.toString() : '',
//               value: message.value ? message.value.toString() : '',
//               timestamp: message.timestamp ? DateUtil.timestampToString(Number(message.timestamp))! : '',
//               offset: Number(message.offset)
//             })
//             //判断数据是否都刷完
//             partitionQuerySize[`${partition}`] = currentPartitionIndex - 1;
//             allSize--;
//           }
//           if (allSize === 0) {
//             clearTimeout(timer);
//             consumer.disconnect();
//             resolve({success: true, data});
//           }
//         },
//       })
//       for (let seekParam of seekParams) {
//         const {partition, offset} = seekParam;
//         consumer.seek({topic, partition, offset: String(offset)});
//       }
//     })
//   }
// }
