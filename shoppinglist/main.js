const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow;
let addWindow;

// Listen for the app to be ready

app.on('ready', () => {
    //Create a new window
    mainWindow = new BrowserWindow({});

    //Load HTML into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    })

    // Build menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Insert menu
    Menu.setApplicationMenu(mainMenu)
});

// Handle create add window

function createAddWindow() {
    //Create a new window
    addWindow = new BrowserWindow({
        width: 200,
        height: 300,
        title: 'Add Shopping List Item'
    });

    //Load HTML into the window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage collection handle
    addWindow.on('close', function () {
        addWindow = null
    })
}

ipcMain.on('item:add', function(e,item){
    console.log(item)
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

// Create menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        // submenu: [
        //     { role: 'undo' },
        //     { role: 'redo' },
        //     { type: 'separator' },
        //     { role: 'cut' },
        //     { role: 'copy' },
        //     { role: 'paste' },
        //     { role: 'pasteandmatchstyle' },
        //     { role: 'delete' },
        //     { role: 'selectall' }
        // ]
    },
    {
        label: 'View',
        // submenu: [
        //     { role: 'reload' },
        //     { role: 'forcereload' },
        //     { role: 'toggledevtools' },
        //     { type: 'separator' },
        //     { role: 'resetzoom' },
        //     { role: 'zoomin' },
        //     { role: 'zoomout' },
        //     { type: 'separator' },
        //     { role: 'togglefullscreen' }
        // ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        // submenu: [
        //     {
        //         label: 'Learn More',
        //         click() { require('electron').shell.openExternal('https://electronjs.org') }
        //     }
        // ]
    }
]

if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    })

    // // Edit menu
    // mainMenuTemplate[1].submenu.push(
    //     { type: 'separator' },
    //     {
    //         label: 'Speech',
    //         submenu: [
    //             { role: 'startspeaking' },
    //             { role: 'stopspeaking' }
    //         ]
    //     }
    // )

    // Window menu
    // mainMenuTemplate[3].submenu = [
    //     { role: 'close' },
    //     { role: 'minimize' },
    //     { role: 'zoom' },
    //     { type: 'separator' },
    //     { role: 'front' }
    // ]
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}