export class KeysUtils {
  /**
   *
   * @param keys
   * @param prefix
   * @param split
   * 示例： keys = ['aa/test','aa/jj/tt','aa/test/da','','tt/aa'] prefix=aa/ split=/
   * 返回： test,jj
   */
  public keysConvertPathNode(keys: string[]|Set<string>, prefix: string, split: string = '/'):Set<string> {
    const pathSet: Set<string> = new Set();
    for (let key of keys) {
      const lastPath = key.replace(prefix, '');
      const pathSplit = lastPath.split(split);
      pathSet.add(pathSplit[0]);
    }
    return pathSet;
  }
}
