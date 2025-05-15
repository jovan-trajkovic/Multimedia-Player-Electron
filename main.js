const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const fs = require('fs');
const path = require("path");

let isDarkTheme = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Add Videos from JSON",
          click: async () => {
            const mainWindow = BrowserWindow.getFocusedWindow();
            const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
              title: 'Select Video JSON File',
              filters: [{ name: 'JSON Files', extensions: ['json'] }],
              properties: ['openFile']
            });
  
            if (!canceled && filePaths.length > 0) {
              const filePath = filePaths[0];
              const content = fs.readFileSync(filePath, 'utf-8');
              try {
                const videos = JSON.parse(content);
                mainWindow.webContents.send('videos-loaded', videos);
              } catch (e) {
                console.error('Invalid JSON format:', e);
                dialog.showErrorBox('Error', 'The selected file is not a valid JSON.');
              }
            }
          }
        },
        { 
          label: "Exit", 
          click: () => app.quit() 
        }
      ],
    },
    {
      label: "List",
      submenu: [
        {
          label: "Add Static",
          click: () => {
          },
        },
        {
          label: "Edit Static",
          click: () => {
          },
        },
        {
          label: "Add",
          click: () => {
          },
        },
        {
          label: "Edit",
          click: () => {
          },
        },
        {
          label: "Delete",
          click: () => {
          },
        },
      ],
    },
    {
      label: "Settings",
      submenu: [
        {
          label: "App Settings",
          click: () => {
            createSettingsWindow();
          },
        },
      ]
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit(); // Don't quit for Mac OS
});

ipcMain.on("set-theme", (event, theme) => {
  if(theme === "dark")
    isDarkTheme = true;
  else
    isDarkTheme = false;

  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("theme-updated", theme);
  });
});

let settingsWindow = null;

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 300,
    height: 200,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      additionalArguments: [`--theme=${isDarkTheme ? "dark" : "light"}`],
    },
  });

  settingsWindow.loadFile("settings.html");

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

const lastUsedPath = path.join(__dirname, "jsons", "last.json");

function loadLastVideos() {
  if (fs.existsSync(lastUsedPath)) {
    const content = fs.readFileSync(lastUsedPath, "utf-8");
    return JSON.parse(content);
  }
  return [];
}

ipcMain.handle("load-last-videos", () => {
  return loadLastVideos();
});

ipcMain.on("save-last-videos", (event, videos) => {
  fs.writeFileSync(lastUsedPath, JSON.stringify(videos, null, 2));
});