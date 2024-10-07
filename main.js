const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('node:path');

let tray; // Declare a variable to hold the Tray instance
let mainWindow; // Declare a variable for the main window

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'icon.png') // Use icon.png for all platforms
    });

    mainWindow.loadFile('welcome.html');

    // Show the window when the tray icon is clicked
    tray.on('click', () => {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    // Minimize the window to the tray
    mainWindow.on('minimize', () => {
        mainWindow.hide();
    });
}

// Create the tray icon
function createTray() {
    const iconPath = path.join(__dirname, 'icon.png'); // Use icon.png for tray icon
    tray = new Tray(iconPath); // Set the tray icon path
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Restore',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);
    
    tray.setToolTip('My Application'); // Set a tooltip for the tray icon
    tray.setContextMenu(contextMenu); // Set the context menu for the tray
}

app.whenReady().then(() => {
    createTray(); // Create the tray icon
    createWindow(); // Create the main window

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
