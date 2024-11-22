import { IQueryResult } from '../../server-client/common';
import { ServerInfo } from '../../local-store-db/common';

export class QueryUtil {
  public static getErrorMessage(error: IQueryResult) {
    const { code, message } = error;
    // const ok = localize('file.confirm.delete.ok');
    let errorMessage = '';
    if (code) {
      errorMessage = `错误编码：${code}`;
    }
    if (code && message) {
      errorMessage = errorMessage + ',';
    }
    if (message) {
      errorMessage = errorMessage + `错误原因：${message}`;
    }
    return errorMessage;
  }

  public static connectErrorMessage(server: ServerInfo) {
    const { host, port } = server;
    return `Could not connect to ${host}:${port} `;
  }
}
