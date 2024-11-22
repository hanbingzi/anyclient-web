export {};
// import {Autowired, Injectable} from "@opensumi/di";
// import {IDialogService, IMessageService} from "@opensumi/ide-overlay";
// import {IClipboardService} from "@opensumi/ide-core-browser";
// import {RedisService} from "../../server-client/browser/services/redis-service";
// import {IRedisServiceToken} from "../../server-client/common";
// import {IServerService, IServerServiceToken, ServerInfo} from "../../local-store-db/common";
//
// @Injectable()
// export class JsonRedisEditorService {
//   @Autowired(IMessageService)
//   protected readonly messages: IMessageService;
//
//   @Autowired(IDialogService)
//   private readonly dialogService: IDialogService;
//
//   @Autowired(IRedisServiceToken)
//   protected readonly redisService: RedisService;
//
//   @Autowired(IServerServiceToken)
//   private readonly serverService: IServerService;
//
//   @Autowired(IClipboardService)
//   private readonly clipboardService: IClipboardService;
//   public static FakeSaveMap = new Set<string>();
//   private serverInfo: ServerInfo;
//
//   public readyFakeSave(serverId: string, db: number | string = '', keyName: string) {
//     const keyDataId = this.getKeyDataId(serverId, db, keyName);
//     JsonRedisEditorService.FakeSaveMap.add(keyDataId);
//   }
//
//   public async getServerInfo(serverId: string) {
//     if (!this.serverInfo) {
//       this.serverInfo = await this.serverService.findById(serverId);
//     }
//     return this.serverInfo;
//   }
//
//
//   public async getKeyData(serverId: string, db: number | string, keyName: string, showRefreshMessage: boolean = false): Promise<string> {
//     const serverInfo = await this.getServerInfo(serverId);
//     const queryResult = await this.redisService.keyData(serverInfo, db as number, keyName)
//     let keyData: string = "";
//     if (queryResult.success) {
//       const queryData = queryResult.data;
//       if (typeof queryData === "string") {
//         keyData = queryData;
//       } else {
//         // return JSONBig.stringify(queryResult.data,null,4);
//         keyData = JSON.stringify(queryData)
//       }
//       if (showRefreshMessage) {
//         this.messages.info(`${keyName}刷新成功`)
//       }
//     }
//     return keyData
//   }
//
//   public getKeyDataId(serverId: string, db: number | string = 0, keyName: string) {
//     return `${serverId}-${db}-${keyName}`;
//   }
//
//
//   public async saveKeyData(serverId: string, db: number | string = 0, keyName: string, keyData: string) {
//     const keyDataId = this.getKeyDataId(serverId, db, keyName);
//     //这是一个假保存
//     if (JsonRedisEditorService.FakeSaveMap.has(keyDataId)) {
//       JsonRedisEditorService.FakeSaveMap.delete(keyDataId)
//       return;
//     }
//     const serverInfo = await this.getServerInfo(serverId);
//     const execResult = await this.redisService.keySet(serverInfo, db as number, keyName, keyData);
//     if (execResult.success) {
//       this.messages.info(`${keyName}保存成功`)
//     }
//   }
//
//   public async copyData(content: string) {
//     await this.clipboardService.writeText(decodeURIComponent(content.toString()));
//     this.messages.info(`复制成功`)
//   }
//
//
// }
