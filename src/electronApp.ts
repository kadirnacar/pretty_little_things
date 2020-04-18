/**
 * Entry point of the Election app.
 */
import { Route } from '@electronApp';
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
// import installExtension, { REACT_DEVELOPER_TOOLS,REDUX_DEVTOOLS } from 'electron-devtools-installer';

let mainWindow: Electron.BrowserWindow | null;
app.allowRendererProcessReuse = false;

const route = new Route();

// route.use("/api/channels", ChannelsRouter);

const installExtensions = async () => {
    // // const installer = require('electron-devtools-installer');
    // const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    // const extensions = [
    //     REACT_DEVELOPER_TOOLS,
    //     REDUX_DEVTOOLS
    // ]
    // return Promise
    //     .all(extensions.map(name => installExtension(name, forceDownload)))
    //     .catch(console.log)
}

const createWindow = async () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: false,
            devTools: process.env.NODE_ENV === 'production' ? false : true,
        }
    });
    const env = process.env.NODE_ENV;

    if (env == "development") {

        mainWindow.maximize();
        mainWindow.setFullScreen(true);
        await installExtensions();
        mainWindow.webContents.openDevTools();
        mainWindow.webContents.on('devtools-opened', () => {
            setImmediate(() => {
                mainWindow.focus();
            });
        });
    }
    // and load the index.html of the app.
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true
        })
    );



    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.