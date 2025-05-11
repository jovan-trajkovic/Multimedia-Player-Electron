const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
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