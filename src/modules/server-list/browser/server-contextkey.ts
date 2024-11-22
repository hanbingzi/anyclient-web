import { Autowired, Injectable, Optional } from '@opensumi/di';
import { IContextKey, IContextKeyService } from '@opensumi/ide-core-browser';
import { RawContextKey } from '@opensumi/ide-core-browser/lib/raw-context-key';

export const ExplorerViewletVisibleContext = new RawContextKey<boolean>('explorerViewletVisible', true);

export const ExplorerResourceCut = new RawContextKey<boolean>('explorerResourceCut', false);
export const ExplorerFocusedContext = new RawContextKey<boolean>('explorerViewletFocus', false);
export const ExplorerFilteredContext = new RawContextKey<boolean>('explorerViewletFilter', false);

export const FilesExplorerFocusedContext = new RawContextKey<boolean>('filesExplorerFocus', false);
export const FilesExplorerInputFocusedContext = new RawContextKey<boolean>('filesExplorerInputFocus', false);
export const FilesExplorerFilteredContext = new RawContextKey<boolean>('filesExplorerFilteredContext', false);

export const ServerSelectedContext = new RawContextKey<boolean>('serverSelectedContext', false);
export const NodeSelectedContext = new RawContextKey<boolean>('nodeSelectedContext', false);

@Injectable()
export class ServerContextKey {
  @Autowired(IContextKeyService)
  private readonly globalContextKeyService: IContextKeyService;

  public readonly explorerViewletVisibleContext: IContextKey<boolean>;
  public readonly explorerFocused: IContextKey<boolean>;
  public readonly explorerResourceCut: IContextKey<boolean>;
  public readonly explorerFilteredContext: IContextKey<boolean>;

  public readonly filesExplorerFocused: IContextKey<boolean>;
  public readonly filesExplorerInputFocused: IContextKey<boolean>;
  public readonly filesExplorerFilteredContext: IContextKey<boolean>;
  public readonly serverSelectedContext: IContextKey<boolean>;
  public readonly nodeSelectedContext: IContextKey<boolean>;

  private readonly _contextKeyService: IContextKeyService;

  constructor(@Optional() dom: HTMLDivElement) {
    this._contextKeyService = this.globalContextKeyService.createScoped(dom);

    this.explorerViewletVisibleContext = ExplorerViewletVisibleContext.bind(this._contextKeyService);

    this.explorerResourceCut = ExplorerResourceCut.bind(this._contextKeyService);
    this.explorerFocused = ExplorerFocusedContext.bind(this._contextKeyService);
    this.explorerFilteredContext = ExplorerFilteredContext.bind(this._contextKeyService);

    this.filesExplorerFocused = FilesExplorerFocusedContext.bind(this._contextKeyService);
    this.filesExplorerInputFocused = FilesExplorerInputFocusedContext.bind(this._contextKeyService);
    this.filesExplorerFilteredContext = FilesExplorerFilteredContext.bind(this._contextKeyService);

    this.serverSelectedContext = ServerSelectedContext.bind(this._contextKeyService);
    this.nodeSelectedContext = NodeSelectedContext.bind(this._contextKeyService);
  }

  get service() {
    return this._contextKeyService;
  }
}
