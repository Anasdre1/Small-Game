const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("SteamBridge", {
  status: () => ipcRenderer.invoke("steam:status"),
  submit: score => ipcRenderer.invoke("steam:submit", score),
  top: n => ipcRenderer.invoke("steam:top", n),
  quit: () => ipcRenderer.send("app:quit"),
  toggleFullscreen: () => ipcRenderer.send("app:fullscreen"),
});
