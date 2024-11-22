import { ISqlQueryParam, ISqlQueryResult } from '../../common';

export abstract class ConnectionTools {
  public dead: boolean = false;

  abstract getClient();

  abstract query(params: ISqlQueryParam, callback?: queryCallback): void ;

  abstract connect(callback: (err: Error) => void): Promise<void>;

  abstract beginTransaction(callback: (err: Error) => void): Promise<void>;

  abstract rollback(): Promise<void>;

  abstract commit(): Promise<void>;

  abstract close(): Promise<void>;

  abstract isAlive(): Promise<boolean>;

  abstract ping(): Promise<boolean>;

}

/**
 * fieldInfo, need name/orgTable
 */
export type queryCallback = (err: Error | null, results?: ISqlQueryResult) => void;

export abstract class DefaultConnection extends ConnectionTools {
  getClient() {
    throw new Error('Method not implemented.');
  }


  query(params:ISqlQueryParam, callback?: queryCallback) {
    throw new Error('DefaultConnection query Method not implemented.');
  }

  async beginTransaction(callback: (err: Error) => void) {
    throw new Error('DefaultConnection connect Method not implemented.');
  }

  async rollback() {
    throw new Error('DefaultConnection rollback Method not implemented.');
  }

  async commit() {
    throw new Error('DefaultConnection commit Method not implemented.');
  }


  async ping(): Promise<boolean> {
    throw new Error('DefaultConnection ping Method not implemented.');
  }
}
