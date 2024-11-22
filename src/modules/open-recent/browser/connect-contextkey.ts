import { Optional, Injectable, Autowired } from '@opensumi/di';
import { IContextKeyService, IContextKey } from '@opensumi/ide-core-browser';
import { RawContextKey } from '@opensumi/ide-core-browser/lib/raw-context-key';
// import {
//   ExplorerResourceIsFolderContext,
//   ExplorerViewletVisibleContext,
//   ExplorerFocusedContext,
//   ExplorerResourceCut,
//   FilesExplorerFocusedContext,
//   FilesExplorerInputFocusedContext,
//   FilesExplorerFilteredContext,
//   ExplorerCompressedLastFocusContext,
//   ExplorerCompressedFocusContext,
//   ExplorerCompressedFirstFocusContext,
// } from '@opensumi/ide-core-browser/lib/contextkey/explorer';

export const ExplorerResourceIsFolderContext = new RawContextKey<boolean>('connectResourceIsFolder', false);
export const ExplorerViewletVisibleContext = new RawContextKey<boolean>('connectViewletVisible', true);

export const ExplorerResourceCut = new RawContextKey<boolean>('connectResourceCut', false);
export const ExplorerFocusedContext = new RawContextKey<boolean>('connectViewletFocus', false);
export const ExplorerFilteredContext = new RawContextKey<boolean>('connectViewletFilter', false);

export const FilesExplorerFocusedContext = new RawContextKey<boolean>('connectsExplorerFocus', false);
export const FilesExplorerInputFocusedContext = new RawContextKey<boolean>('connectsExplorerInputFocus', false);
export const FilesExplorerFilteredContext = new RawContextKey<boolean>('connectsExplorerFilteredContext', false);

// compressed nodes
// export const ExplorerCompressedFocusContext = new RawContextKey<boolean>('connectViewletCompressedFocus', false);
// export const ExplorerCompressedFirstFocusContext = new RawContextKey<boolean>(
//   'connectViewletCompressedFirstFocus',
//   false,
// );
// export const ExplorerCompressedLastFocusContext = new RawContextKey<boolean>(
//   'connectViewletCompressedLastFocus',
//   false,
// );
//以上是文件系统自带的，以下是需要自己设置的
//当前状态的节点是否是成功加载状态
export const FilesExplorerFocusedSuccessContext = new RawContextKey<boolean>('connectsExplorerFocusSuccess', false);

@Injectable()
export class ConnectContextkey {
  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  public readonly explorerResourceIsFolder: IContextKey<boolean>;
  public readonly explorerViewletVisibleContext: IContextKey<boolean>;
  public readonly explorerFocused: IContextKey<boolean>;
  public readonly explorerResourceCut: IContextKey<boolean>;
  public readonly filesExplorerFocused: IContextKey<boolean>;
  public readonly filesExplorerInputFocused: IContextKey<boolean>;
  public readonly filesExplorerFilteredContext: IContextKey<boolean>;
  // public readonly explorerCompressedFocusContext: IContextKey<boolean>;
  // public readonly explorerCompressedFirstFocusContext: IContextKey<boolean>;
  // public readonly explorerCompressedLastFocusContext: IContextKey<boolean>;

  private readonly _contextKeyService: IContextKeyService;

  constructor(@Optional() dom: HTMLDivElement) {
    this._contextKeyService = this.globalContextKeyService.createScoped(dom);
    this.explorerResourceIsFolder = ExplorerResourceIsFolderContext.bind(this._contextKeyService);
    this.explorerViewletVisibleContext = ExplorerViewletVisibleContext.bind(this._contextKeyService);
    this.explorerFocused = ExplorerFocusedContext.bind(this._contextKeyService);
    this.explorerResourceCut = ExplorerResourceCut.bind(this._contextKeyService);

    this.filesExplorerFocused = FilesExplorerFocusedContext.bind(this._contextKeyService);
    this.filesExplorerInputFocused = FilesExplorerInputFocusedContext.bind(this._contextKeyService);
    this.filesExplorerFilteredContext = FilesExplorerFilteredContext.bind(this._contextKeyService);

    // this.explorerCompressedFocusContext = ExplorerCompressedFocusContext.bind(this._contextKeyService);
    // this.explorerCompressedFirstFocusContext = ExplorerCompressedFirstFocusContext.bind(this._contextKeyService);
    // this.explorerCompressedLastFocusContext = ExplorerCompressedLastFocusContext.bind(this._contextKeyService);
  }

  get service() {
    return this._contextKeyService;
  }
}
