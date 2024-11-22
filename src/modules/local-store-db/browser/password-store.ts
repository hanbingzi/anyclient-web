export class PasswordStore {

  private static pdStoreMap: Map<string, string> = new Map();

  public static setPassword(serverId:string,password:string){
    this.pdStoreMap.set(serverId,password);
  }

  public static getPassword(serverId:string){
    return this.pdStoreMap.get(serverId)
  }

}
