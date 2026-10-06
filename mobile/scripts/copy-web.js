// Copies the game from the repo root into mobile/www, which Capacitor packages into the apps.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..", "..");
const www = path.resolve(__dirname, "..", "www");
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, "fonts"), { recursive: true });
for (const f of ["index.html", "crosswind-app.js", "firebase-config.js"]) fs.copyFileSync(path.join(root, f), path.join(www, f));
for (const f of fs.readdirSync(path.join(root, "fonts"))) fs.copyFileSync(path.join(root, "fonts", f), path.join(www, "fonts", f));
console.log("Copied the game into mobile/www");
