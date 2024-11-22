import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { DataItemInfoContribution } from './data-item-info.contribution';
import { DataItemInfoService } from './data-item-info.service';

@Injectable()
export class DataItemInfoModule extends BrowserModule {
  providers: Provider[] = [DataItemInfoContribution, DataItemInfoService];
}
