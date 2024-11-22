import { Injectable } from '@opensumi/di';
import { ConnectQuery } from '../../local-store-db/common';
import { Client } from 'node-zookeeper-client';
import { AbstractBaseClient } from './base-client';
import { IQueryResult, IZkInfo, IZkStat, IZookeeperServiceClient } from '../common';

@Injectable()
export class ZookeeperServiceClient extends AbstractBaseClient implements IZookeeperServiceClient {

  async ping(connect: ConnectQuery): Promise<IQueryResult> {
    try {
      await this.getConnection(connect);
      console.log('zookeeper ping success_____------------------->');
      return { success: true };
    } catch (e) {
      console.log('zookeeper ping fail_____------------------->');
      return this.getErrorResult(e);
    } finally {
      await this.closeConnection(connect);
    }
  }

  public getErrorResult(error: any): IQueryResult {
    return { success: false, message: error.message, code: error.errno }; //sql: error.sql,
  }

  public async listChildren(connect: ConnectQuery, path: string): Promise<IQueryResult<IZkInfo[]>> {
    const client = (await this.getClient(connect)) as Client;
    // let client = zookeeper.createClient('127.0.0.1:2181')
    // console.log('listChildren-->getclient:', client, ':path:', path)
    // client.connect();
    return new Promise<IQueryResult>((resolve, reject) => {
      // client.once('connected', () => {
      client.getChildren(path, async (error, children, stat) => {
        if (error) {
          console.log('Failed to list children of %s due to: %s.', path, error);
          resolve(this.getErrorResult(error));
        }
        console.log('Children of %s are: %j.', path, children);
        let data: IZkInfo[] = [];
        for (let item of children) {
          let fullPath = path === '/' ? '/' + item : path + '/' + item;
          console.log('listChildren itemPath:', fullPath);
          const [exist, stat] = await this.exist(client, fullPath);
          exist && data.push({ name: item, stat });
        }
        resolve({ success: true, data });
      });
      // })
    });
  }

  public async exist(client: Client, path: string): Promise<[boolean, IZkStat]> {
    return new Promise<[boolean, IZkStat]>((resolve, reject) => {
      client.exists(path, (error, stat) => {
        if (!error) {
          resolve([true, new IZkStat(stat)]);
        }
        resolve([false, {}]);
      });
    });
  }

  public async getData(connect: ConnectQuery, fullPath: string): Promise<IQueryResult<IZkInfo>> {
    const client = (await this.getClient(connect)) as Client;
    return new Promise<IQueryResult<IZkInfo>>((resolve, reject) => {
      client.getData(fullPath, (error, data, stat) => {
        if (error) {
          resolve(this.getErrorResult(error));
        }
        resolve({
          success: true,
          data: {
            fullPath,
            data: data ? data.toString('utf8') : '',
            stat: stat ? new IZkStat(stat) : null,
          },
        });
      });
    });
  }

  public async delete(connect: ConnectQuery, fullPath: string): Promise<IQueryResult> {
    //console.log('zookeeper delete',connect.server)
    const client = (await this.getClient(connect)) as Client;
    return new Promise<IQueryResult>((resolve) => {
      client.remove(fullPath, (error) => {
        if (error) {
          resolve(this.getErrorResult(error));
        }
        resolve({ success: true });
      });
    });
  }

  public async setData(connect: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult> {
    const client = (await this.getClient(connect)) as Client;
    return new Promise<IQueryResult>((resolve) => {
      client.setData(fullPath, Buffer.from(data), (error) => {
        if (error) {
          resolve(this.getErrorResult(error));
        }
        resolve({ success: true });
      });
    });
  }

  public async create(connect: ConnectQuery, fullPath: string): Promise<IQueryResult> {
    const client = (await this.getClient(connect)) as Client;
    return new Promise<IQueryResult>((resolve) => {
      client.create(fullPath, (error) => {
        if (error) {
          resolve(this.getErrorResult(error));
        }
        resolve({ success: true });
      });
    });
  }

  public async createWithData(connect: ConnectQuery, fullPath: string, data: string): Promise<IQueryResult> {
    //console.log('zookeeper createWithData',connect.server)

    const client = (await this.getClient(connect)) as Client;
    return new Promise<IQueryResult>((resolve) => {
      client.create(fullPath, Buffer.from(data), (error) => {
        if (error) {
          console.log('zookeeper-error-->', error);
          resolve(this.getErrorResult(error));
        }
        resolve({ success: true });
      });
    });
  }
}
