export {}
// import { Autowired, Injectable } from '@opensumi/di';
// import {
//   IBroker,
//   IKafkaClientRPCPath,
//   IKafkaClientServicePath,
//   IKafkaService,
//   IKafkaServiceClient,
//   IMessageBase,
//   IPartition,
//   IQueryResult,
//   IQueryStart,
//   TopicCreateParam,
// } from '../../common';
// import { ConnectQuery } from '../../../local-store-db/common';
// import { GroupOverview } from 'kafkajs';
// import { RPCService } from '@opensumi/ide-connection';
// import { KafkaRpcClient } from '../../node/kafka-rpc-client';
//
//
// @Injectable()
// export class KafkaRPCService extends RPCService  {
//
//   @Autowired(IKafkaClientRPCPath)
//   private kafkaRpcClient: KafkaRpcClient;
//
//   showMessage = () => {
//     console.log('showMessage')
//     this.kafkaRpcClient.showMessage('test');
//   };
//
//   onMessage = (message: string) => {
//     console.log('----->', message);
//   };
//
//
//
// }
