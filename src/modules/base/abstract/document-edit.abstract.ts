import { Emitter } from '@opensumi/ide-utils';
import { ConnectQuery, ServerInfo } from '../../local-store-db/common';
import { ServerType } from '../types/server-node.types';
import { OpenOption } from '../param/open-view.param';

export abstract class DocumentEditAbstract {
  protected readonly onFirstInitFinishEmitter = new Emitter<boolean>();

  protected readonly onDataChangeEmitter = new Emitter<any>();

  public firstInitFinish: boolean = false;
  public server: ServerInfo;
  public option: OpenOption;
  public serverType: ServerType;
  public db: string|number;
  public viewId: string;
  public data: any;

  public getData(){
    return this.data;
  }



  get onFirstInitFinish() {
    return this.onFirstInitFinishEmitter.event;
  }

  get onDataChange() {
    return this.onDataChangeEmitter.event;
  }

  getConnect(): ConnectQuery {
    return { server: this.server, db: this.db };
  }

  public docUpdateData(data: any) {
    this.data = data;
    this.onDataChangeEmitter.fire(data);

    if (!this.firstInitFinish) {
      this.firstInitFinish = true;
      this.onFirstInitFinishEmitter.fire(true);
    }

  }
}
