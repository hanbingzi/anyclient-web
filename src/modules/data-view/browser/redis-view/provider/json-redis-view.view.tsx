export {};
// import {ICodeEditor, IEditorDocumentModelService} from '@opensumi/ide-editor/lib/browser';
// import React, {useEffect, useMemo, useRef} from 'react';
// import styles from '../data-editor.module.less'
// import {URI, useInjectable} from "@opensumi/ide-core-browser";
// import type {
//   IStandaloneCodeEditor
// } from "@opensumi/monaco-editor-core/esm/vs/editor/standalone/browser/standaloneCodeEditor";
// import {EditorCollectionService} from "@opensumi/ide-editor";
// import {IDataEditorViewer} from "../../doc-editor/common";
// import {JsonRedisEditorServiceToken, JSONRedisViewProviderToken} from "../../../common";
// import {JsonRedisEditorService} from "./json-redis-editor.service";
// import {JSONRedisViewProvider} from "./json-redis-view.provider";
// import {EditorOption} from "../../../../doc-editor/browser/editor-option.view";
//
// export function JsonRedisViewView(param: IDataEditorViewer) {
//   const { height, serverId, db, keyName, onSelectModel} = param;
//   const jsonRedisEditorService: JsonRedisEditorService = useInjectable(JsonRedisEditorServiceToken);
//   const editorCollectionService: EditorCollectionService = useInjectable(EditorCollectionService);
//   const docManager: IEditorDocumentModelService = useInjectable(IEditorDocumentModelService);
//   const docProvider: JSONRedisViewProvider = useInjectable(JSONRedisViewProviderToken);
//
//   const editorHtmlRef = useRef<HTMLDivElement>(null);
//   const editorRef = useRef<IStandaloneCodeEditor>(null);
//   const iCodeEditorRef = useRef<ICodeEditor>(null);
//
//
//   // init monaco CodeEditor
//   useEffect(() => {
//     if (editorHtmlRef.current && !editorRef.current) {
//       const editor2 = editorCollectionService.createCodeEditor(
//         editorHtmlRef.current,
//         {
//           value: "",
//           automaticLayout: true,
//           readOnly: false,
//           minimap: {
//             enabled: false,
//           },
//         }
//       );
//       // @ts-ignore
//       iCodeEditorRef.current = editor2;
//
//       setTimeout(() => {
//
//         editor2.layout();
//         //editor2.monacoEditor.getAction('editor.action.formatDocument').run();
//         //editor2.monacoEditor.trigger("anyString","editor.action.formatDocument")
//       }, 0);
//
//       docManager
//         .createModelReference(currentUri
//           , "editor-react-component")
//         .then((ref) => {
//           editor2.open(ref);
//         })
//         .catch(console.error);
//       // @ts-ignore
//       editorRef.current = editor2.monacoEditor;
//     }
//   }, [editorHtmlRef.current]);
//
//   const currentUri = useMemo(() => {
//     return URI.from({
//       scheme: 'json-view-scheme',
//       query: URI.stringifyQuery({serverId, db, keyName}),
//     })
//   }, [serverId, db, keyName])
//
//
//   const handleSave = () => {
//     //执行一个真save
//     iCodeEditorRef.current?.save();
//
//   }
//   const handleRefresh = () => {
//     jsonRedisEditorService.readyFakeSave(serverId, db, keyName)
//     //这是一个假save，因为目前opensumi如果文本被编辑，不执行save，会拒绝刷新,希望以后能解决opensumi中monaco编辑器的问题
//     iCodeEditorRef.current?.save();
//     setTimeout(() => {
//       docProvider.fireDidChangeContent(currentUri);
//     }, 50)
//   }
//
//
//   return (
//     <div className={styles['date-editor-container']}>
//
//       <EditorOption
//         {...{serverId, db, keyName, enableSave: true, enableRefresh: true}}
//         model={'Json'}
//         onSave={() => {
//           handleSave();
//         }}
//         onRefresh={() => {
//           handleRefresh();
//         }}
//         onSelectMode={onSelectModel!}
//       />
//       <div
//         ref={editorHtmlRef}
//         //28为操作框的高度
//         style={{marginTop: '3px', width: '100%', flexGrow: 1, height: height - 28 + 'px'}}>
//
//       </div>
//     </div>
//   )
// }
