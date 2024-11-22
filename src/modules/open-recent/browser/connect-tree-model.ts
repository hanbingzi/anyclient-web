import { Injectable, Optional, Autowired } from '@opensumi/di';
//import { TreeModel, IOptionalMetaData, TreeNodeEvent, CompositeTreeNode } from '@opensumi/ide-components';
import { URI, ThrottledDelayer, Emitter, Event } from '@opensumi/ide-core-browser';
import { FileStat } from '@opensumi/ide-file-service';

//import { Directory } from '../common/connect-tree-node.define';

import { ConnectTreeDecorationService } from './services/connect-tree-decoration.service';
import { TreeModel, IOptionalMetaData, TreeNodeEvent, CompositeTreeNode } from '../../components/recycle-tree';
import { ServerNode } from '../common/connect-tree-node.define';

export interface IFileTreeMetaData extends IOptionalMetaData {
  uri: URI;
  filestat?: FileStat;
}

@Injectable({ multiple: true })
export class ConnectTreeModel extends TreeModel {
  static DEFAULT_FLUSH_DELAY = 100;

  @Autowired(ConnectTreeDecorationService)
  public readonly decorationService: ConnectTreeDecorationService;

  private flushDispatchChangeDelayer = new ThrottledDelayer<void>(ConnectTreeModel.DEFAULT_FLUSH_DELAY);
  private onWillUpdateEmitter: Emitter<void> = new Emitter();

  constructor(@Optional() root: ServerNode) {
    super();
    this.init(root);
  }

  get onWillUpdate(): Event<void> {
    return this.onWillUpdateEmitter.event;
  }

  init(root: CompositeTreeNode) {
    this.root = root;
    // 分支更新时通知树刷新, 不是立即更新，而是延迟更新，待树稳定后再更新
    // 100ms的延迟并不能保证树稳定，特别是在node_modules展开的情况下
    // 但在普通使用上已经足够可用，即不会有渲染闪烁问题
    this.root.watcher.on(TreeNodeEvent.BranchDidUpdate, this.doDispatchChange.bind(this));
    // 主题或装饰器更新时，更新树
    this.decorationService.onDidChange(this.doDispatchChange.bind(this));
  }

  doDispatchChange() {
    if (!this.flushDispatchChangeDelayer.isTriggered()) {
      this.flushDispatchChangeDelayer.cancel();
    }
    this.flushDispatchChangeDelayer.trigger(async () => {
      await this.onWillUpdateEmitter.fireAndAwait();
      this.dispatchChange();
    });
  }
}
