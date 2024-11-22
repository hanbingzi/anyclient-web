import { Autowired, Injectable } from '@opensumi/di';
import { Emitter } from '@opensumi/ide-utils';
import { DocumentEditorService } from '../../doc-editor/browser/document-editor.service';
import { useInjectable } from '@opensumi/ide-core-browser';
import { DocumentEditorServiceToken } from '../../doc-editor/common';
import { IDialogService } from '@opensumi/ide-overlay';

export const JsonId = 'data-item-info-json';

@Injectable()
export class DataItemInfoService {
  @Autowired(DocumentEditorServiceToken)
  private documentEditorService: DocumentEditorService;

  private readonly onDataChangeEmitter = new Emitter<any>();

  public get onDataChange() {
    return this.onDataChangeEmitter.event;
  }

  public showData(data: any) {
    this.onDataChangeEmitter.fire(data);
    //data is json?
    DocumentEditorService.Store.set(JsonId, {
      keyData: data,
      parsedData: data,
    });
    this.documentEditorService.shouldUpdateJsonData(JsonId);
  }

  public clearData() {
    this.onDataChangeEmitter.fire('');
  }
}
