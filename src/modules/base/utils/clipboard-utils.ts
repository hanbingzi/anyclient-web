export class ClipboardUtils {
  public static async writeText(text: string): Promise<void> {
    try {
      // 优先使用 clipboard 设置
      // clipboard 在非 https 下会报错
      return await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);
    }
  }

  public static async readText(): Promise<string> {
    try {
      if (!navigator.clipboard) {
        console.error('The current environment does not support the `clipboard` API');
        return '';
      }
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error(error);
      return '';
    }
  }
}
