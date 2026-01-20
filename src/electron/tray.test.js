import { expect, test, vi } from "vitest";
import createTray from "./tray";
import { app, Menu } from "electron";

vi.mock('electron', ()=>{
    return {
        Tray: vi.fn().mockReturnValue({
            setContextMenu: vi.fn()
        }),
        app: {
            getAppPath: vi.fn().mockReturnValue("/"),
            quit: vi.fn()
        },
        Menu: {
            buildFromTemplate: vi.fn()
        }
    }
})

const mainWindow = {show: vi.fn()}

test("", ()=>{
    createTray(mainWindow)
    const calls = Menu.buildFromTemplate.mock.calls
    const args = calls[0]
    const template = args[0]
    expect(template).toHaveLength(2)

    expect(template[0].label).toEqual("Open")
    template[0]?.click?.()
    expect(mainWindow.show).toHaveBeenCalled()
    expect(template[1].label).toEqual("Quit")
    template[1]?.click?.()
    expect(app.quit).toHaveBeenCalled()
})