import osUtils from 'os-utils';
import fs from 'fs';
import os from 'os'
import si from 'systeminformation'
import { ipcWebContentsSend } from './utils.js'; 
const POLLING_INTERVAL = 500; // in ms

function getCPUUsage(){
    return new Promise(resolve =>{
        osUtils.cpuUsage(resolve);
    })
}

function getMemoryUsage(){
    return 1-osUtils.freememPercentage();
}

function getStorageUsage(){
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.blocks * stats.bsize;
    const free = stats.bfree * stats.bsize;
    return {
        total: Math.floor(total / 1_000_000_000),
        usage: 1 - free / total
    }
}

export function getStaticData(){
    const totalStorage = getStorageUsage().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemory = Math.floor(os.totalmem() / 1024);
    return {totalStorage, cpuModel, totalMemory};
}

export async function getDetailedPcInfo() {
    const cpu = await si.cpu(); // { manufacturer, brand, speed, cores, ... }
    const mem = await si.mem(); // { total, free, used, active, ... }
    const osInfo = await si.osInfo(); // { platform, distro, release, kernel, arch, ... }
    const battery = await si.battery(); // { hasBattery, percent, isCharging, ... }
    const graphics = await si.graphics(); // GPUs and displays
    const disks = await si.diskLayout(); // Array of drives with size, type (HDD/SSD), etc.
    const network = await si.networkInterfaces(); // Detailed network adapters

    return { cpu, mem, osInfo, battery, graphics, disks, network };
}

export function pollResources(mainWindow){
    setInterval(async () => {
        const cpuUsage = await getCPUUsage();
        const memoryUsage = getMemoryUsage();
        const storageUsage = getStorageUsage();
        ipcWebContentsSend("statistics", mainWindow.webContents, {cpuUsage: cpuUsage, memoryUsage: memoryUsage, storageUsage: storageUsage.usage})
        // console.log(`CPU usage: ${(cpuUsage*100).toFixed(2)}%, Memory usage: ${(memoryUsage*100).toFixed(2)}% ,Storage usage: ${storageUsage.free}`);
        
    }, POLLING_INTERVAL);
}

