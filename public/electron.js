const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path  = require("path");
const os    = require("os");

// ipcMain.on('closeWindow', ()=>{
//   app.quit();
// });

// let splash;
let mainWindow;


//---
// var loadingwindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    // preload: path.join(__dirname, 'preload.js'),
    show: false,
    center : true,
    minHeight : 600,
    minWidth : 1300,
    // frame: false,
    // titleBarStyle: 'hidden',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      zoomFactor: 0.9
    },
  });

  mainWindow.maximize();
  mainWindow.setMenuBarVisibility(false);

  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);
  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.on("ready",createWindow);