import { exec, spawn } from 'child_process';
const jdbcPathWin = 'C:\\DevData\\MyDevGithub\\level4\\any-client-electron\\resources\\jdbc\\clientbiz-jdbc-driver.jar';
const jdbcPath1 = 'C:\\Program Files\\Clientbiz\\jdbc\\clientbiz-jdbc-driver.jar';

const jdbcPathMac = '/Users/yanqi/devData/myDevGitHub/level5/any-client-startup/resources/jdbc/clientbiz-jdbc-driver.jar';
const jarProcess = spawn('java', ['-jar', jdbcPathMac]);

jarProcess.stdout.on('data', (data) => {
  console.log(`JAR stdout: ${data}`);
});
// exec(`java -jar ${jdbcPath1}`, (error, stdout) => {
//     if (error) {
//         console.log('start jdbc driver error------------>');
//         console.log(error);
//     }
// });
