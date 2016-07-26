const electron = require('electron')
const fs = require("fs")
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const session = electron.session
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let browserWindw

const {ipcMain} = require('electron');
ipcMain.on('image-msg', (event, msg) => {
  browserWindw.webContents.send('image-msg', msg);
});


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1366, height: 768})
  browserWindw = new BrowserWindow({width: 1366, height: 768})

  // and load the index.html of the app.
  //mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.loadURL("http://www.youzi4.cc/")
  browserWindw.loadURL(`file://${__dirname}/image_browser.html`)
  //console.log(`file://${__dirname}/index.html`)
  let pageInitScriptFile = `${__dirname}/page_init.js`;
  let appPath = app.getPath("appData")+"/com.grant.image.browser";
  if(!fs.existsSync(appPath)){
    fs.mkdirSync(appPath)
    fs.mkdirSync(appPath+"/scripts")
    fs.mkdirSync(appPath+"/cache")
    fs.mkdirSync(appPath+"/download")
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  browserWindw.webContents.openDevTools()
  let webContents = mainWindow.webContents;
  const filter ={
  urls:[
      "*://*.baidu.com/*",
      "*://*.baidustatic.com/*",
      "*://*.cnzz.com/*"
    ]
  }
  let ses = webContents.session;
  ses.webRequest.onBeforeSendHeaders(filter,(details,callback) => {
    callback({cancel: true,requestHeaders: details.requestHeaders})
  })
  webContents.on("did-get-response-details",function () {
    webContents.executeJavaScript("require('"+pageInitScriptFile+"');window.imageMatch.init()");
  });

  //mainWindow.webContents.executeJavaScript("require(`file://${__dirname}/image_match.js`)");
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
