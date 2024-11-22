import { Domain } from '@opensumi/ide-core-browser';
import {
  BrowserEditorContribution,
  IEditorDocumentModelContentProvider,
  IEditorDocumentModelContentRegistry,
} from '@opensumi/ide-editor/lib/browser';
import { Autowired } from '@opensumi/di';
import { JSONEditorDocumentContentProviderToken, TextEditorDocumentContentProviderToken } from '../common';

/**
 * 常量要全部大写
 */

@Domain(BrowserEditorContribution)
export class DataEditorContribution implements BrowserEditorContribution {
  @Autowired(JSONEditorDocumentContentProviderToken)
  private readonly JSONEditorDocumentContentProvider: IEditorDocumentModelContentProvider;

  // @Autowired(TextEditorDocumentContentProviderToken)
  // private readonly textEditorDocumentContentProvider: IEditorDocumentModelContentProvider;

  registerEditorDocumentModelContentProvider(registry: IEditorDocumentModelContentRegistry): void {
    registry.registerEditorDocumentModelContentProvider(this.JSONEditorDocumentContentProvider);
    //registry.registerEditorDocumentModelContentProvider(this.textEditorDocumentContentProvider);
  }
}
