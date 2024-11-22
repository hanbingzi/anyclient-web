import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { WelcomeContribution } from './welcome.contribution';

@Injectable()
export class AnyClientWelcomeModule extends BrowserModule {
  providers: Provider[] = [WelcomeContribution];
}
