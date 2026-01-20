import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { ipcMainHandle, ipcMainOn, isDev } from "./utils.js";
import { getStaticData, pollResources, getDetailedPcInfo } from "./resourceManager.js";
import { getAssetsPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import createTray from "./tray.js";
import createMenu from "./menu.js";


Menu.setApplicationMenu(null)
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: true,
  });
    mainWindow.loadFile("dist-react/index.html");
    if (isDev()) {
      mainWindow.loadURL("http://localhost:5123");
    } else {
      mainWindow.loadURL(getUIPath());
    }

    createMenu(mainWindow)
    pollResources(mainWindow);

    ipcMainHandle("getStaticData", () => {return getStaticData()})
    ipcMainHandle("getDetailedPcInfo", async()=>{
      try {
        return await getDetailedPcInfo()
      } catch (error) {
        console.log(error);
        return error
      }
    })
    ipcMainOn("sendFrameAction", (payload) => {
      switch (payload) {
        case "CLOSE":
          mainWindow.close();
          break;
        case "MINIMIZE":
          mainWindow.minimize();
          break;
        case "MAXIMIZE":
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
          }else{
            mainWindow.maximize();
          }
          break;
      }
    })

    createTray(mainWindow)
    handleCloseEvent(mainWindow)
});


function handleCloseEvent(mainWindow) {
  let willClose = false
  mainWindow.on('close', (e)=>{
    if (willClose) {
      return
    }
    e.preventDefault();
    mainWindow.hide();
  })

  app.on('before-quit', ()=>{
    willClose = true
  })

  mainWindow.on('show', ()=>{
    willClose = false
  })
}