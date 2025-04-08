// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const {contextBridge,ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, ...args) => {
            // whitelist channels
            let validChannels = ["askToRead", "askToWrite"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, ...args);
            }else {
                throw "invalid channel"
            }
        },
        receive: (channel, func) => {
            let validChannels = ["sendReadContent"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }else {
                throw "invalid channel"
            }
        }
    }
)