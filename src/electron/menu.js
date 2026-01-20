import { app, Menu } from "electron";
import { ipcWebContentsSend, isDev } from "./utils.js";

export default function createMenu(mainWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: "App",
            type: "submenu",
            submenu: [
                {
                    label: "Quit",
                    click: ()=>{
                        app.quit()
                    }
                },
                {
                    label: "Devtools",
                    click: ()=>mainWindow.webContents.openDevTools(),
                    visible: isDev()
                },
            ]
        },
        {
            label: "Settings",
            type: "submenu",
            submenu: [
                {
                    label: "CPU",
                    click: ()=>ipcWebContentsSend('changeView', mainWindow.webContents, "CPU"),
                },
                {
                    label: "Storage",
                    click: ()=>ipcWebContentsSend('changeView', mainWindow.webContents, "STORAGE"),
                },
                {
                    label: "RAM",
                    click: ()=>ipcWebContentsSend('changeView', mainWindow.webContents, "RAM"),
                },
            ]
        },
    ]))
}