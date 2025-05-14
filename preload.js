const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("videoAPI", {
  getVideos: () => [
    {
      name: "Sample Video 1",
      file: "assets/videos/video1.mp4",
      thumbnail: "assets/images/thumbnail1.jpg",
      author: "Author1",
      duration: "120",
      createdAt: "2024-05-01",
    },
    {
      name: "Sample Video 2",
      file: "assets/videos/video2.mp4",
      thumbnail: "assets/images/thumbnail2.jpg",
      author: "Author 2",
      duration: "100",
      createdAt: "2024-05-02",
    },
  ],
});

contextBridge.exposeInMainWorld("windowAPI", {
  setTheme: (theme) => {ipcRenderer.send("set-theme", theme)},
  onThemeChanged: (callback) =>
    ipcRenderer.on("theme-updated", (event, theme) => callback(theme)),
});


const themeArg = process.argv.find((arg) => arg.startsWith("--theme="));
const currentTheme = themeArg ? themeArg.split("=")[1] : "light";

contextBridge.exposeInMainWorld("initialTheme", {
  value: currentTheme,
});