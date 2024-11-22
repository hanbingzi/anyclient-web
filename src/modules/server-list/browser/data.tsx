import React from 'react';
// import {Kafka, Mysql} from "server";
// import {Db, Table, Tables} from "node";
// import {IServerTreeNode} from "../../base/model/server-tree-node.model";
//
//
// export const mysqlSampleData:IServerTreeNode[] = [ {
//     label: 'OA',
//     sort: 1,
//     key: '0-0',
//     levelType: 'node',
//     server: 'Mysql',
//     nodeType: 'db',
//     headIcon: <Db />
// }, {
//     label: 'OA2',
//     sort: 1,
//     key: '0-2',
//     levelType: 'node',
//     server: 'Mysql',
//     nodeType: 'db',
//     headIcon: (<Db />)
// }]
//
// export const treeDataInit: IServerTreeNode[] = [
//     {
//         label: 'Mysql',
//      //   sort: 0,
//         key: '0',
//         levelType: 'server',
//        // server: 'Mysql',
//
//         headIcon: <Mysql/>,
//         // expanded:true,
//         // expandable:true,
//         // nodeStat: "init",
//         children: [{
//             label: 'OA',
//             sort: 1,
//             key: '0-0',
//             levelType: 'node',
//             server: 'Mysql',
//             nodeType: 'db',
//             headIcon: (<Db/>),
//             children: [
//                 {
//                     label: 'Table',
//                     sort: 2,
//                     key: '0-0-0',
//                     levelType: 'node',
//                     server: 'Mysql',
//                     nodeType: 'tables',
//                     headIcon: (<Tables/>),
//                     // children: [
//                     //     {
//                     //         label: 'Public',
//                     //         sort: 3,
//                     //         key: '0-0-0-0',
//                     //         levelType: 'node',
//                     //         info: {
//                     //
//                     //             server: 'mysql',
//                     //             nodeType: 'table'
//                     //         },
//                     //         headIcon: (<Table/>)
//                     //     },
//                     //     {
//                     //         label: 'Table',
//                     //         sort: 4,
//                     //         key: '0-0-0-1',
//                     //         levelType: 'node',
//                     //         info: {
//                     //
//                     //             server: 'mysql',
//                     //             nodeType: 'table'
//                     //         },
//                     //         headIcon: (<Table/>)
//                     //     }
//                     // ],
//                 },],
//         },],
//     },
//     {
//         label: 'Kafka',
//    //     sort: 1,
//         key: '1',
//      //   headIcon: <Kafka/>,
//         children: []
//     },
//     {
//         label: 'PostgreSql',
//     //    sort: 2,
//         key: '2',
//         nodeStat: 'init',
//     //    headIcon: <PostgreSql/>,
//         children: []
//     },
// {
//     label: 'Redis',
//     sort: 3,
//     key: '3',
//     headIcon: <Redis/>,
//     levelType: 'root',
//     info: {
//
//         server: 'redis'
//     },
//     children: [
//         {
//             label: 'Auth',
//             sort: 1,
//             key: '3-0',
//             headIcon: <DirectoryOpen/>,
//             levelType: 'node',
//             info: {
//
//                 server: 'redis',
//                 nodeType: 'node'
//             },
//             children: [
//                 {
//                     label: 'Public',
//                     sort: 2,
//                     key: '3-0-0',
//                     levelType: 'node',
//                     info: {
//
//                         server: 'redis',
//                         nodeType: 'node'
//                     },
//                     headIcon: <DirectoryOpen/>,
//                 },
//                 {
//                     label: 'Token',
//                     sort: 3,
//                     key: '3-0-1',
//                     levelType: 'node',
//                     info: {
//
//                         server: 'redis',
//                         nodeType: 'node'
//                     },
//                     headIcon: <DirectoryOpen/>,
//
//                     children: [
//                         {
//                             label: '8d62a530297caa754a76d409b9bc4efb',
//                             sort: 4,
//                             key: '3-0-1-0',
//                             levelType: 'entity',
//                             info: {
//
//                                 server: 'redis',
//                                 nodeType: 'key'
//                             },
//                             headIcon: <FileKey/>,
//                         },
//                         {
//                             label: '408c9354713fb02ea3949501367321c2',
//                             sort: 5,
//                             key: '3-0-1-1',
//                             levelType: 'entity',
//                             info: {
//
//                                 server: 'redis',
//                                 nodeType: 'key'
//                             },
//                             headIcon: <FileKey/>,
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             label: 'hanbingzi',
//             sort: 6,
//             key: '3-1',
//             levelType: 'entity',
//             info: {
//
//                 server: 'redis',
//                 nodeType: 'key'
//             },
//             headIcon: <FileKey/>,
//         },
//         {
//             label: 'lengbingzi',
//             sort: 7,
//             key: '3-2',
//             headIcon: <FileKey/>,
//         },
//     ],
// },
// {
//     label: 'Snowflake',
//     sort: 4,
//     key: '4',
//     headIcon: <Snowflake/>,
//     children: [],
//
// }, {
//     label: 'RocketMQ',
//     sort: 5,
//     key: '5',
//     headIcon: <Rocketmq/>,
// }, {
//     label: 'Zookeeper',
//     sort: 6,
//     key: '6',
//     headIcon: <Zookeeper/>,
// }, {
//     label: 'Zookeeper',
//     sort: 7,
//     key: '7',
//     headIcon: <Zookeeper/>,
// }, {
//     label: 'nacos',
//     sort: 8,
//     key: '8',
//     headIcon: <Nacos/>,
// }, {
//     label: 'mongodb',
//     sort: 9,
//     key: '9',
//     headIcon: <Mongodb/>,
// }, {
//     label: 'Mariadb',
//     sort: 10,
//     key: '10',
//     headIcon: <Mariadb/>,
// }, {
//     label: 'Kafka',
//     sort: 11,
//     key: '11',
//     headIcon: <Kafka/>,
// }, {
//     label: 'influxdb',
//     sort: 12,
//     key: '12',
//     headIcon: <Influxdb/>,
// }, {
//     label: 'hive',
//     sort: 13,
//     key: '13',
//     headIcon: <Hive/>,
// }, {
//     label: 'Eurka',
//     sort: 14,
//     key: '14',
//     headIcon: <Eureka/>,
// }, {
//     label: 'Elasticsearch',
//     sort: 15,
//     key: '15',
//     headIcon: <Elasticsearch/>,
// }
//];
