const path = require('path');
const querystring = require('querystring');
const rimraf = require('rimraf');
const fs = require('fs-extra');
const compressing = require('compressing');
const log = require('debug')('InstallExtension');
const pipeline = require('stream').pipeline;
const retry = require('async-retry');

// 放置 extension 的目录
const targetDir = path.resolve(__dirname, '../extensions/');

const extensionName = 'lengbingzi.anyclient-extension';

// 限制并发数，运行promise


function unzipFile(dist, targetDirName, tmpZipFile) {
  const sourcePathRegex = new RegExp('^extension');
  return new Promise((resolve, reject) => {
    try {
      const extensionDir = path.join(dist, targetDirName);
      const stream = new compressing.zip.UncompressStream({source: tmpZipFile});
      stream
        .on('error', (err) => {
          reject(err);
        })
        .on('finish', () => {
          if (!fs.pathExistsSync(path.join(extensionDir, 'package.json'))) {
            reject(`Download Error: ${extensionDir}/package.json`);
            return;
          }
          fs.remove(tmpZipFile).then(() => resolve(extensionDir));
        })
        .on('entry', (header, stream, next) => {
          stream.on('end', next);
          if (!sourcePathRegex.test(header.name)) {
            stream.resume();
            return;
          }
          let fileName = header.name.replace(sourcePathRegex, '');
          if (/\/$/.test(fileName)) {
            const targetFileName = path.join(extensionDir, fileName);
            fs.mkdirp(targetFileName, (err) => {
              if (err) {
                return reject(err);
              }
              stream.resume();
            });
            return;
          }
          const targetFileName = path.join(extensionDir, fileName);
          fs.mkdirp(path.dirname(targetFileName), (err) => {
            if (err) {
              return reject(err);
            }
            const writerStream = fs.createWriteStream(targetFileName, {mode: header.mode});
            pipeline(stream, writerStream, (err) => {
              if (err) {
                return reject(err);
              }
            });
          });
        });
    } catch (err) {
      reject(err);
    }
  });
}

const installExtension = async () => {

  // 解压插件，使用 opentrs 插件时解压缩容易出错，因此这里加一个重试逻辑
  await retry(() => unzipFile(targetDir, extensionName, '/Users/yanqi/devData/myDevGitHub/level5/any-client-extension/lengbingzi-any-client-extension-1.0.3.zip'), {retries: 5});

  // rimraf.sync(tmpZipFile);
  //}
};

const downloadVscodeExtensions = async () => {
  //log('清空 extension 目录：%s', targetDir);

  rimraf.sync(path.join(targetDir,extensionName));
  //fs.mkdirpSync(targetDir);

  try {
    await installExtension();
  } catch (e) {
    console.log(`${name} 插件安装失败: ${e.message}`);
  }

  log('安装完毕');
};

// 执行并捕捉异常
downloadVscodeExtensions().catch((e) => {
  console.trace(e);
  rimraf();
  process.exit(128);
});
