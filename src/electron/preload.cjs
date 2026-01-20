const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback) => {
        ipcOn("statistics", (stats)=>{
            callback(stats);    
        })
    },
    subscribeChangeView: (callback) => {
        ipcOn("changeView", (stats)=>{
            callback(stats);    
        })
    },
    getStaticData: ()=> ipcInvoke("getStaticData"),
    getDetailedPcInfo: ()=> ipcInvoke("getDetailedPcInfo"),
    sendFrameAction: (payload) => ipcSend("sendFrameAction", payload)
})

function ipcInvoke(key) {
    return electron.ipcRenderer.invoke(key)
}

function ipcOn(key, callback) {
    electron.ipcRenderer.on(key, (_, payload)=>callback(payload))
    return () => electron.ipcRenderer.off(key, (_, payload)=>callback(payload))
}

function ipcSend(key, payload) {
    electron.ipcRenderer.send(key, payload)
}