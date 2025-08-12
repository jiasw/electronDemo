const { app, BrowserWindow } = require('electron')
const path = require('path');
const express = require('express');


let mainWindow;
let server;

let config={
  BackgroundServer:"",
  Count:0
}

function loadConfig() {
  try {
    const fs = require('fs');
    const configPath = path.join(__dirname, 'appconfig.json');
      const data = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(data);
    }
   catch (error) {
    console.error(error);
  }
}

function saveConfig() {
  try {
    const fs = require('fs');
    const configPath = path.join(__dirname, 'appconfig.json');
    const data = JSON.stringify(config);
    fs.writeFileSync(configPath, data);
  } catch (error) {
    console.error(error);
  }
}

function createLocalServer(directoryPath) {
  loadConfig();
  config.Count++;
  config.BackgroundServer = directoryPath;
  saveConfig();
  console.log(`Local server count: ${config.Count}`);
  const expressApp = express();
  
  // 静态文件服务
  expressApp.use(express.static(directoryPath));
  
  // 错误处理
  expressApp.use((req, res) => {
    res.status(404).send('File not found');
  });
 
  return expressApp.listen(0, () => {
    const port = server.address().port;
    console.log(`Local server running at http://127.0.0.1:${port}/`);
  });
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, //  需要开启nodeIntegration
    },
  });
// 指定要服务的本地目录
  const localDirectory = path.join(__dirname, 'vueapp');
  // 启动本地服务器
  server = createLocalServer(localDirectory);
  mainWindow.loadURL(`http://127.0.0.1:${server.address().port}/`);
}
app.whenReady().then(() => {
  createWindow();
 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
 
// 清理服务器
app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});