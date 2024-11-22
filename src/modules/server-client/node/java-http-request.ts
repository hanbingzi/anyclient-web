import { Injectable } from '@opensumi/di';

import axios from 'axios';
import { IQueryResult, QueryResultError } from '../common';
import { ConnectQuery } from '../../local-store-db/common';
import { AppConstants } from '../../../common/constants';

// 创建axios实例
const axiosService = axios.create({
  baseURL: AppConstants.JdbcUrl, //process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 1000 * 60 * 3, // 请求超时时间
  headers: {
    "Content-Type'": 'application/json',
  },
});

// 请求拦截器
axiosService.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头等信息
    // 例如：config.headers['Authorization'] = 'Bearer your-token';
    return config;
  },
  (error) => {
    // 请求错误处理
    console.log(error); // for debug
    Promise.reject(error);
  },
);

// 响应拦截器
axiosService.interceptors.response.use(
  (response) => {
    // 对响应数据做处理，例如只返回data部分
    const res = response.data;
    // 如果返回的状态码为200，说明成功，可以直接返回数据
    return res;
  },
  (error) => {
    // 对响应错误做处理
    console.log('err' + error); // for debug
    return Promise.reject(error);
  },
);

@Injectable()
export class JavaHttpRequest {
  private static sqlRequestUrl: String = 'sql/';

  public async setServer(connect: ConnectQuery) {
    console.log('setServer---------->', JSON.stringify(connect.server));
    await axiosService.post(JavaHttpRequest.sqlRequestUrl + 'setServer', {
      server: connect.server,
      cluster: connect.cluster,
    });
  }

  public async httpPost(url: string, param?: any): Promise<IQueryResult> {
    url = JavaHttpRequest.sqlRequestUrl + url;
    console.log('httpPost-->', url, JSON.stringify(param));
    const response = await axiosService.post(url, param);
    console.log('httpPost response:', response);
    return response as any;
  }

  /**
   * 为了防止每次请求都需要传输完整的server，
   * 所以只传serverId，如果检测到server不存在，就setServer以下
   * @param connect
   * @param url
   * @param params
   */
  public async sqlPost(connect: ConnectQuery, url: string, params?: any): Promise<IQueryResult> {
    let retry = 1;
    url = JavaHttpRequest.sqlRequestUrl + url;
    const queryRequest = {
      connect: {
        serverId: connect.server.serverId,
        db: connect.db,
        schema: connect.schema,
        originPassword: connect.originPassword,
      } as ConnectQuery,
      data: params,
    };
    console.log('sqlPost', url, JSON.stringify(queryRequest));
    const result = await axiosService
      .post(url, queryRequest)
      .then(async (response) => {
        if (response && (response as any).code === -1 && retry < 2) {
          retry++;
          await this.setServer(connect);
          return axiosService.post(url, queryRequest);
        }
        //console.log('sqlPost-response1--->', response);
        return response;
      })
      .then((response2) => {
        console.log('sqlPost-response2--->', response2);
        return response2;
      })
      .catch((reason) => {
        console.log('sqlPost-error————》', reason);
        return { ...QueryResultError.UNKNOWN_ERROR, message: reason.message };
      });
    return result as any;
  }
}
