export function isValidFolderName(folderName: string) {
  // Windows文件夹禁止的字符正则表达式
  const forbiddenChars = /[<>:"/\\|?*]/;

  // 检查是否包含禁止的字符
  if (forbiddenChars.test(folderName)) {
    return false;
  }

  // 检查文件夹名称是否以空格或点结尾
  if (folderName.endsWith('.')) {
    return false;
  }

  // 检查文件夹名称是否保留名称 (CON, PRN, AUX, NUL, COM1, LPT1等)
  const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.[^.]*)?$/i;
  if (reservedNames.test(folderName)) {
    return false;
  }

  // 名称有效
  return true;
}

//
