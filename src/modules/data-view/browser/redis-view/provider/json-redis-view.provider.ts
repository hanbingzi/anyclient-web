export {};
// import {Autowired, Injectable} from '@opensumi/di';
// import {
//   Emitter,
//   Event,
//   IEditorDocumentChange,
//   IEditorDocumentModelSaveResult,
//   MaybePromise,
//   SaveTaskResponseState,
//   URI
// } from '@opensumi/ide-core-common';
// import {IEditorDocumentModelContentProvider} from '@opensumi/ide-editor/lib/browser';
// import {EOL} from '@opensumi/ide-monaco/lib/common/types';
// import {JsonRedisEditorServiceToken} from "../../../common";
// import {JsonRedisEditorService} from "./json-redis-editor.service";
//
// // 在OpenSumi Core项目中，可以参考的源码实现:
// // fs-editor-doc.ts / untitled-resource.ts
// @Injectable()
// export class JSONRedisViewProvider implements IEditorDocumentModelContentProvider {
//
//
//   @Autowired(JsonRedisEditorServiceToken)
//   protected readonly jsonRedisEditorService: JsonRedisEditorService;
//
//
//   handlesScheme?(scheme: string): MaybePromise<boolean> {
//     return scheme === 'json-view-scheme';
//   }
//
//   async provideEditorDocumentModelContent(uri: URI, encoding?: string | undefined): Promise<string> {
//     //console.log('provideEditorDocumentModelContent', uri.toString());
//     //获取数据
//     const {serverId, db, keyName} = uri.getParsedQuery()
//     //console.log(`provideEditorDocumentModelContent :serverId:${serverId},db:${db},keyName:${keyName}`)
//
//     //获取数据
//     //return JSON.stringify(fakeDBServer)
//     const queryData = await this.jsonRedisEditorService.getKeyData(serverId, db , keyName)
//     //console.log(`provideEditorDocumentModelContent :serverId:${serverId},db:${db},keyName:${keyName} -queryResult`, queryResult)
//
//     return queryData;
//
//   }
//
//   isReadonly(uri: URI): MaybePromise<boolean> {
//     return false;
//   }
//
//   saveDocumentModel?(uri: URI, content: string, baseContent: string, changes: IEditorDocumentChange[], encoding?: string | undefined, ignoreDiff?: boolean | undefined, eol?: EOL | undefined): MaybePromise<IEditorDocumentModelSaveResult> {
//     // 这里实现保存数据的逻辑
//  //console.log(`saveDocumentModel, uri:${uri}, content:${content}, baseContent:${baseContent}, changes, encoding, ignoreDiff, eol`);
//     const {serverId, db, keyName} = uri.getParsedQuery()
//     this.jsonRedisEditorService.saveKeyData(serverId,db,keyName,content)
//     return {
//       state: SaveTaskResponseState.SUCCESS,
//     };
//   }
//
//   preferLanguageForUri?(uri: URI): MaybePromise<string | undefined> {
//     return 'json';
//   }
//
//   private _onDidChangeContent: Emitter<URI> = new Emitter();
//
//   public onDidChangeContent: Event<URI> = this._onDidChangeContent.event;
//
//   // 外部触发刷新事件
//   // 但是要注意的点：当用户手动修改编辑器中的文档（格式化也是一种修改），导致Document处于dirty状态时，底层的文档更新不会显示在编辑器上
//   // 参见源码：https://vscode.dev/github/opensumi/core/blob/8f6f12a8a1479800d1510ec34e7783d7eb0d682d/packages/editor/src/browser/doc-model/editor-document-model-service.ts#L190
//   // 这算是一种编辑冲突的问题
//   public fireDidChangeContent(uri: URI) {
//     this._onDidChangeContent.fire(uri);
//   }
//
// }
