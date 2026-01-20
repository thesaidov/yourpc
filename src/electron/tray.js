import { app, Menu, Tray } from 'electron'
import path from 'path'
import { getAssetsPath } from './pathResolver.js'

export default function createTray(mainWindow) {
    const tray = new Tray(path.join(getAssetsPath(), "desktopTrayIcon.png"))
    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: "Open",
                click: ()=>{
                    mainWindow.show();
                },        
            },
            {
                label: "Quit",
                click: ()=>app.quit()
            }
        ])
    )
}
