import { Autowired, Injectable, Optional } from '@opensumi/di';
// import { Decoration, TargetMatchMode } from '@opensumi/ide-components';
import { Decoration, TargetMatchMode } from '../../../components/recycle-tree';
import { DisposableCollection, ILogger, WithEventBus } from '@opensumi/ide-core-browser';
import { IConnectTreeServiceToken } from '../../common';
import { ServerEntity, ServerNode } from '../../common/connect-tree-node.define';
import treeNodeStyles from '../connect-tree-node.module.less';
import styles from '../connect-tree.module.less';
import { ConnectTreeService } from '../connect-tree.service';
import { ConnectTreeModelService } from './connect-tree-model.service';
import { IOpenRecentService, IOpenRecentServiceToken } from '../../../local-store-db/common';

@Injectable()
export class ConnectDragAndDropService extends WithEventBus {
  static MS_TILL_DRAGGED_OVER_EXPANDS = 500;

  // @Autowired(IConnectTreeAPI)
  // private readonly connectTreeAPI: IConnectTreeAPI;

  @Autowired(ILogger)
  private readonly logger: ILogger;

  // @Autowired(IMessageService)
  // private readonly messageService: IMessageService;

  @Autowired(IConnectTreeServiceToken)
  private readonly connectTreeService: ConnectTreeService;

  @Autowired(IOpenRecentServiceToken)
  private readonly openRecentService: IOpenRecentService;

  private toCancelNodeExpansion: DisposableCollection = new DisposableCollection();

  private beingDraggedDec: Decoration = new Decoration(treeNodeStyles.mod_dragging);
  private draggedOverDec: Decoration = new Decoration(treeNodeStyles.mod_dragover);

  // 上一次拖拽进入的目录
  // 开始拖拽的节点
  private beingDraggedNode: ServerNode | undefined;

  // 拖拽进入的节点
  private draggedOverNode: ServerNode | ServerEntity | undefined;

  //private dragOverTrigger = new ThrottledDelayer<void>(ConnectDragAndDropService.MS_TILL_DRAGGED_OVER_EXPANDS);

  constructor(@Optional() private readonly model: ConnectTreeModelService) {
    super();
    this.model.decorations.addDecoration(this.beingDraggedDec);
    this.model.decorations.addDecoration(this.draggedOverDec);
  }

  get root() {
    return this.model.treeModel.root;
  }

  handleDragStart = (ev: React.DragEvent, dragNode: ServerNode) => {
    ev.stopPropagation();
    // React中的DragEnd事件可能不会触发，需要手动用Dom监听
    // issue https://stackoverflow.com/a/24543568
    //console.log('handleDragStart----------->')
    ev.currentTarget.addEventListener(
      'dragend',
      (ev) => {
        this.handleDragEnd(ev, dragNode);
      },
      false,
    );

    this.beingDraggedNode = dragNode;

    this.beingDraggedDec.addTarget(dragNode, TargetMatchMode.Self);
    //
    if (ev.dataTransfer) {
      let label: string = dragNode.displayName;
      const dragImage = document.createElement('div');
      dragImage.className = styles.file_tree_drag_image;
      dragImage.textContent = label;
      document.body.appendChild(dragImage);
      ev.dataTransfer.setDragImage(dragImage, -10, -10);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  //当进入目标时，添加状态
  handleDragEnter = (ev: React.DragEvent, node: ServerNode | ServerEntity) => {
    ev.stopPropagation();
    ev.preventDefault();
  };

  //当离开目标时，清除状态
  handleDragLeave = (ev: React.DragEvent, node: ServerNode | ServerEntity) => {
    ev.preventDefault();
    ev.stopPropagation();
    //console.log('handleDragLeave----------->')
    // this.toCancelNodeExpansion.dispose();
    // 拖拽目标离开时，清除选中态
    if (this.draggedOverNode) {
      this.draggedOverDec.removeTarget(this.draggedOverNode);
      // 通知视图更新
      this.model.treeModel.dispatchChange();
    }
  };

  //@lengbingzi 经过目标时，目标需要做的操作，不明白为什么用dragover，而不用dragenter，dragenter应该效率更好
  handleDragOver = (ev: React.DragEvent, node: ServerNode | ServerEntity) => {
    ev.preventDefault();
    ev.stopPropagation();
    //console.log('handleDragOver----------->')
    // if (!this.toCancelNodeExpansion.disposed) {
    //   return;
    // }
    if (node.levelType !== 'server') {
      return;
    }
    if (this.beingDraggedNode!.path === node.path) {
      return;
    }
    //删除上个文件被赋予的样式
    if (this.draggedOverNode && this.draggedOverNode.path !== node.path) {
      this.draggedOverDec.removeTarget(this.draggedOverNode);
    }
    this.draggedOverNode = node;

    this.draggedOverDec.addTarget(this.draggedOverNode, TargetMatchMode.Self);
    this.model.treeModel.dispatchChange();
  };

  //处理移动后的排序
  handleDrop = async (ev: React.DragEvent, containerNode?: ServerNode | ServerEntity) => {
    //console.log('handleDrop----------->')
    try {
      ev.preventDefault();
      ev.stopPropagation();
      //   // 移除染色
      ev.dataTransfer.dropEffect = 'copy';
      if (!containerNode || containerNode.levelType !== 'server') {
        return;
      }
      await this.openRecentService.autoSort(
        this.beingDraggedNode!.openRecentId!,
        (containerNode as ServerNode)!.openRecentId!,
      );
      if (this.draggedOverNode) {
        this.draggedOverDec.removeTarget(this.draggedOverNode);
        this.draggedOverNode = undefined;
      }
      if (this.beingDraggedNode) {
        this.beingDraggedDec.removeTarget(this.beingDraggedNode);
        this.beingDraggedNode = undefined;
      }
      //通知视图更新,视图更新没有用，的重新刷新
      this.connectTreeService.refresh();
      //  this.model.treeModel.dispatchChange();
    } catch (e) {
      this.logger.error(e);
    }
  };

  //
  handleDragEnd = (ev: React.DragEvent, node: ServerNode | ServerEntity) => {
    //console.log('handleDragEnd----------->')
    if (this.draggedOverNode) {
      this.draggedOverDec.removeTarget(this.draggedOverNode);
      this.draggedOverNode = undefined;
    }
    if (this.beingDraggedNode) {
      this.beingDraggedDec.removeTarget(this.beingDraggedNode);
      this.beingDraggedNode = undefined;
    }
  };
}
