// Crosswind desktop app for Steam. Electron window + Steamworks (leaderboard).
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "steam.json"), "utf8"));
const APP_ID = Number(config.appId);
const BOARD = config.leaderboard || "HighScore";

let steam = null, sdk = null, board = null, steamError = "";

function initSteam() {
  try {
    sdk = require("steamworks-ffi-node");
    const SteamworksSDK = sdk.default || sdk.SteamworksSDK || sdk;
    steam = SteamworksSDK.getInstance();
    // The SDK files live outside the .asar archive once packaged.
    const sdkDir = app.isPackaged
      ? path.join(process.resourcesPath, "app.asar.unpacked", "steamworks_sdk")
      : path.join(__dirname, "steamworks_sdk");
    steam.setSdkPath(sdkDir);
    // A real release must be launched through Steam; Steam relaunches it if needed.
    if (app.isPackaged && APP_ID !== 480 && steam.restartAppIfNecessary(APP_ID)) { app.quit(); return false; }
    if (!steam.init({ appId: APP_ID })) { steamError = "Steam isn't running, or this account doesn't own the game."; steam = null; return false; }
    setInterval(() => { try { steam.runCallbacks(); } catch {} }, 250);
    return true;
  } catch (e) {
    steamError = "Steam support isn't available in this build.";
    console.warn("Steam init failed:", e && e.message);
    steam = null;
    return false;
  }
}

async function getBoard() {
  if (!steam) return null;
  if (board) return board;
  board = await steam.leaderboards.findOrCreateLeaderboard(BOARD, sdk.LeaderboardSortMethod.Descending, sdk.LeaderboardDisplayType.Numeric);
  return board;
}

function nameFor(steamId) {
  try {
    const me = steam.getStatus().steamId;
    if (steamId === me) return steam.friends.getPersonaName();
    const n = steam.friends.getFriendPersonaName(steamId);
    return n && n !== "[unknown]" ? n : "Pilot " + String(steamId).slice(-4);
  } catch { return "Pilot"; }
}

ipcMain.handle("steam:status", () => ({ ready: !!steam, error: steamError, name: steam ? nameFor(steam.getStatus().steamId) : "" }));

ipcMain.handle("steam:submit", async (_e, score) => {
  try {
    const b = await getBoard();
    if (!b) return { ok: false };
    const r = await steam.leaderboards.uploadScore(b.handle, Math.max(0, Math.floor(Number(score) || 0)), sdk.LeaderboardUploadScoreMethod.KeepBest);
    if (!r || !r.success) return { ok: false };
    return { ok: true, improved: r.scoreChanged, rank: r.globalRankNew, best: r.scoreChanged ? r.score : null };
  } catch (e) { return { ok: false }; }
});

ipcMain.handle("steam:top", async (_e, n) => {
  try {
    const b = await getBoard();
    if (!b) return { ok: false };
    const entries = await steam.leaderboards.downloadLeaderboardEntries(b.handle, sdk.LeaderboardDataRequest.Global, 1, Math.min(100, n || 25));
    await new Promise(r => setTimeout(r, 300)); // give Steam a moment to fetch player names
    const me = steam.getStatus().steamId;
    return { ok: true, uid: me, rows: entries.map(e => ({ id: e.steamId, name: nameFor(e.steamId), score: e.score, platform: "steam" })) };
  } catch (e) { return { ok: false }; }
});

ipcMain.on("app:quit", () => app.quit());
ipcMain.on("app:fullscreen", (e) => { const w = BrowserWindow.fromWebContents(e.sender); if (w) w.setFullScreen(!w.isFullScreen()); });

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 720, minWidth: 800, minHeight: 450,
    fullscreen: true, backgroundColor: "#0b1424", title: "Crosswind", show: false,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.once("ready-to-show", () => win.show());
  win.loadFile(path.join(__dirname, "game", "index.html"));
  win.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown" && (input.key === "F11" || (input.alt && input.key === "Enter"))) { win.setFullScreen(!win.isFullScreen()); event.preventDefault(); }
  });
  // Keep the game inside the app: open any outside links in the system browser.
  win.webContents.setWindowOpenHandler(({ url }) => { require("electron").shell.openExternal(url); return { action: "deny" }; });
}

Menu.setApplicationMenu(null);
app.whenReady().then(() => { initSteam(); createWindow(); });
app.on("window-all-closed", () => app.quit());
app.on("before-quit", () => { try { steam && steam.shutdown(); } catch {} });
