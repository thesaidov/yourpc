import { isDev } from "./utils.js";
import path from "path";
import { app } from "electron";

export function getPreloadPath() {
    console.log(path.join(
        app.getAppPath(), isDev() ? "." : "..",
        '/src/electron/preload.cjs'
    ));
    
    return path.join(
        app.getAppPath(), isDev() ? "." : "..",
        '/src/electron/preload.cjs'
    )
}

export function getUIPath() {
    return path.join(app.getAppPath(), 'dist-react/index.html')
}

export function getAssetsPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets")
}