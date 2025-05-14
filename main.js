const { app, BrowserWindow, Menu, ipcMain } = require("electron");
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
      submenu: [{ label: "Exit", click: () => app.quit() }],
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