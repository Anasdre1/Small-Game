// Copies the game from the repo root into desktop/game and adds the Steam leaderboard script.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..", "..");
const out = path.resolve(__dirname, "..", "game");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "fonts"), { recursive: true });
let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
// The Steam build uses Steam's leaderboard, so it doesn't need the Firebase bundle.
html = html.replace('<script src="firebase-config.js"></script>\n<script src="crosswind-app.js"></script>', '<script src="steam-leaderboard.js"></script>');
if (!html.includes("steam-leaderboard.js")) throw new Error("Couldn't find the leaderboard script tags in index.html");
fs.writeFileSync(path.join(out, "index.html"), html);
fs.copyFileSync(path.resolve(__dirname, "..", "steam-leaderboard.js"), path.join(out, "steam-leaderboard.js"));
for (const f of fs.readdirSync(path.join(root, "fonts"))) fs.copyFileSync(path.join(root, "fonts", f), path.join(out, "fonts", f));
console.log("Copied the game into desktop/game");
