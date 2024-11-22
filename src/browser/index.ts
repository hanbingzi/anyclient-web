import '@opensumi/ide-i18n/lib/browser';
import { ExpressFileServerModule } from '@opensumi/ide-express-file-server/lib/browser';
import '@opensumi/ide-core-browser/lib/style/index.less';
import '@opensumi/ide-core-browser/lib/style/icon.less';
import { setLocale } from '@opensumi/ide-monaco/lib/browser/monaco-localize';
import '../common/i18n/setup';

import { renderApp } from './render-app';
import { CommonBrowserModules } from './common-modules';
import { layoutConfig } from './layout-config';
import './main.less';
import './styles.less';
import {TodoModule} from "../modules/todo/browser";
import {AppAdminModule} from "../modules/admin/browser";
import {LocalDbBrowserModule} from "../modules/local-store-db/browser";
import {ServerManagerModule} from "../modules/server-manager/browser";
import {ServerOpenRecentModule} from "../modules/open-recent";
import {ServerTreeModule} from "../modules/server-list/browser";
import {ServerClientModule} from "../modules/server-client/browser";
import {ToolbarOptionModule} from "../modules/toolbar-option/browser";
import {DataViewBrowserModule} from "../modules/data-view/browser";
import {DataEditorBrowserModule} from "../modules/doc-editor/browser";
import {QueryExplorerModule} from "../modules/query-explorer/browser";
import {CodelensCommandModule} from "../modules/codelens-command/browser";
import {DataItemInfoModule} from "../modules/data-item-info/browser";
import {LOCALE_TYPES} from "@opensumi/ide-core-common/lib/const";
import { ServerExplorerModule } from '../modules/server-explorer/browser';


const defaultLanguage = LOCALE_TYPES.ZH_CN;
setLocale(defaultLanguage);

renderApp({
  modules: [
    ...CommonBrowserModules,
    ExpressFileServerModule,
    // 附加开发的
    //DataExplorerModule,
    //LanguageModule,
    ServerExplorerModule,
    ToolbarOptionModule,
    ServerTreeModule,
    TodoModule,
    LocalDbBrowserModule,
    ServerManagerModule,
    ServerOpenRecentModule,
    ServerClientModule,
    DataViewBrowserModule,
    DataEditorBrowserModule,
    QueryExplorerModule,
    CodelensCommandModule,
    DataItemInfoModule,
    AppAdminModule
  ],
  layoutConfig,
  useCdnIcon: false,
  useExperimentalShadowDom: false,
  defaultPreferences: {
    'general.theme': 'clientbiz-dark',//'opensumi-dark',//
    'general.icon': 'vscode-icons',
  },
  defaultPanels: {
    'bottom': '@opensumi/ide-terminal-next',
    'right': '',
  },
  appName: 'ClientBiz'
});
