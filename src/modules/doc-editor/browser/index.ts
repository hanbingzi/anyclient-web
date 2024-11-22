import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { DataEditorContribution } from './data-editor.contribute';
import { JSONEditorDocumentContentProvider } from './provider/json-document.provider';
import { TextEditorDocumentContentProvider } from './provider/text-document.provider';
import { DocumentEditorService } from './document-editor.service';
import {
  DocumentEditorServiceToken,
  JSONEditorDocumentContentProviderToken,
  TextEditorDocumentContentProviderToken,
} from '../common';

@Injectable()
export class DataEditorBrowserModule extends BrowserModule {
  providers: Provider[] = [
    DataEditorContribution,
    {
      token: JSONEditorDocumentContentProviderToken,
      useClass: JSONEditorDocumentContentProvider,
    },
    // {
    //   token: TextEditorDocumentContentProviderToken,
    //   useClass: TextEditorDocumentContentProvider,
    // },
    {
      token: DocumentEditorServiceToken,
      useClass: DocumentEditorService,
    },
  ];
}
