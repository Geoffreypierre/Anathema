const { Menu } = require('electron');

const createMenu = (mainWindow) => {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Request',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => mainWindow.webContents.send('menu-new-request')
                },
                {
                    label: 'Save Collection',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => mainWindow.webContents.send('menu-save-collection')
                },
                {
                    label: 'Load Collection',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => mainWindow.webContents.send('menu-load-collection')
                },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        if (process.platform !== 'darwin') {
                            require('electron').app.quit();
                        }
                    }
                }
            ]
        },
        {
            label: 'Request',
            submenu: [
                {
                    label: 'Send',
                    accelerator: 'CmdOrCtrl+Return',
                    click: () => mainWindow.webContents.send('menu-send-request')
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'History',
                    accelerator: 'CmdOrCtrl+H',
                    click: () => mainWindow.webContents.send('menu-show-history')
                },
                {
                    label: 'Collections',
                    accelerator: 'CmdOrCtrl+Shift+C',
                    click: () => mainWindow.webContents.send('menu-show-collections')
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

module.exports = { createMenu };