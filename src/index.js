const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details;
    // if (details.url.startsWith('https://example.com')) {
    //     responseHeaders['Access-Control-Allow-Origin'] = ['*'];
    //     responseHeaders['Access-Control-Allow-Headers'] = ['*'];
    // }
    responseHeaders['Access-Control-Allow-Origin'] = ['*'];
    responseHeaders['Access-Control-Allow-Headers'] = ['*'];
    callback({
        responseHeaders,
    });
  });
};

/* commented out - electron doesn't read file from current directory when it becomes executable
ipcMain.on("askToRead", (event, file_name) => {
	fs.readFile(path.join(__dirname, file_name),'utf8', (error, data) => {
		mainWindow.webContents.send("sendReadContent", file_name, data);
	})
})

ipcMain.on("askToWrite", (event, file_name, contents) => {
	fs.writeFile(path.join(__dirname, file_name), contents, () => {});
})
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
