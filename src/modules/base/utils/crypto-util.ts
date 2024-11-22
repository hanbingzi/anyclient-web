import * as crypto from 'crypto';

// 创建一个加密密钥和初始化向量
// 设置加密密钥和初始化向量为常量
const encryptionKey = Buffer.from('f3d2e9a4b5c6d7f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e323', 'hex');
const iv = Buffer.from('f3d2e9a4b5c6d7f8a1b2c3d4e5f6a7b8', 'hex');

// 加密函数
export function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

// 解密函数
export function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}
