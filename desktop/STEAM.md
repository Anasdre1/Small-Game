# Publishing Crosswind on Steam

This folder holds the Windows desktop version of Crosswind for Steam. It's an [Electron](https://www.electronjs.org) app that runs the same game file as the web and mobile versions (`index.html` in the repo root). It uses **Steam's built-in leaderboard**, so players post scores under their Steam names; no Firebase is needed.

```
desktop/
  main.js, preload.js      the app window + Steam connection
  steam-leaderboard.js     plugs Steam's leaderboard into the game
  steam.json               your Steam App ID and leaderboard name
  steam-store/             all store/library art, 5 screenshots, STORE_PAGE.md (store text)
  steam-upload/            SteamCMD build script + upload.bat
```

You need a **Windows PC** to build the release. The Steam code includes a Windows-only part that only installs on Windows, and the upload tool runs there too.

---

## Timeline at a glance

| When | What |
|---|---|
| Day 0 | Join Steamworks, pay the $100 app fee, do identity and tax forms |
| Days 1–7 | Fill in the store page, upload art and a build, send both for review (each review takes about 1–5 days) |
| As soon as the store page is approved | Publish it as **Coming Soon**. It must be public for **at least 2 weeks** before release. |
| Day 30 or later | Valve requires 30 days between paying the fee and releasing. Press **Release**. |

---

## Step 1 — Join Steamworks (about 30 minutes, then wait)

1. Go to [partner.steamgames.com](https://partner.steamgames.com) and sign in with your Steam account.
2. Accept the Steam Distribution Agreement.
3. Pay the **Steam Direct fee: $100 per game**. It's paid back to you after the game earns $1,000.
4. Fill in your **bank, tax (W-9 for US residents) and identity verification** info. Valve checks this before you can release.
5. When approved, you get an **App ID** (for example `3456780`). Steamworks also creates a depot ID, usually your App ID + 1.

---

## Step 2 — Set up the app in Steamworks

Open your app in Steamworks and go to **App Admin**.

**Leaderboard**
1. Go to **Stats & Achievements → Leaderboards → New Leaderboard**.
2. Fill in the leaderboard:
   - Name: `HighScore` (must match `desktop/steam.json`)
   - Community name: `High Score`
   - Sort method: **Descending**
   - Display type: **Numeric**
   - Writes: **not** Trusted, because the game posts from the player's PC
3. Go to **Publish → Prepare for publishing → Publish to Steam.** Leaderboard changes don't take effect until you publish them.

**Install and launch**
1. **Installation → General:** set the install folder name to `Crosswind`.
2. **Installation → Launch Options → Add new launch option:**
   - Executable: `Crosswind.exe`
   - Operating system: Windows
   - CPU architecture: 64-bit
3. **SteamPipe → Depots:** make sure there's a depot (for example `3456781`) set to **Windows**, language **All**.
4. Publish again.

---

## Step 3 — Build the game on your Windows PC

One-time setup:
1. Install [Node.js](https://nodejs.org) (LTS) and [Git](https://git-scm.com).
2. In Steamworks, go to **Downloads → Steamworks SDK** and download the SDK zip. Unzip it somewhere, like `C:\steamworks_sdk`.

Then in **Command Prompt**:

```bat
git clone https://github.com/Anasdre1/Small-Game.git
cd Small-Game\desktop
npm install
mkdir steamworks_sdk
xcopy /E /I C:\steamworks_sdk\sdk\redistributable_bin steamworks_sdk\redistributable_bin
```

Open `desktop\steam.json` and change `"appId": 480` to **your** App ID. App 480 is Valve's public test app; keep it while testing if you like.

**Test it with Steam running:** `npm start`. The leaderboard should load, and posting a score should show your Steam name.

**Build the release:**
```bat
npm run dist:win
```
The game is now in `desktop\dist\win-unpacked\`, with `Crosswind.exe` inside. Double-click it to check it runs. With your real App ID it relaunches through Steam, which is normal.

---

## Step 4 — Upload the build

1. Open `desktop\steam-upload\app_build.vdf` in Notepad. Replace `YOUR_APP_ID` with your App ID and `YOUR_WINDOWS_DEPOT_ID` with your depot ID.
2. Find SteamCMD in the SDK: `C:\steamworks_sdk\sdk\tools\ContentBuilder\builder\steamcmd.exe`.
3. Run:
   ```bat
   cd Small-Game\desktop\steam-upload
   set STEAMCMD=C:\steamworks_sdk\sdk\tools\ContentBuilder\builder\steamcmd.exe
   upload.bat
   ```
   Type your Steam username. SteamCMD asks for your password and Steam Guard code in the window. Type them there yourself; never paste them into a script.
4. In Steamworks, go to **SteamPipe → Builds**. Your build appears there. Set it live on the **default** branch and click **Preview Change → Set Build Live Now**.
5. Get a key for yourself in **Request Steam Product Keys**, add the game to your library, install it from Steam and play a round. Post a score to check the leaderboard.

---

## Step 5 — Store page

Go to **Store Admin** in Steamworks. Everything to paste is in `steam-store/STORE_PAGE.md`.

1. **Basic info:** genres, short description, supported OS, Steam features (Leaderboards).
2. **Description:** the "About this game" text (it already uses Steam's BBCode formatting).
3. **Graphical assets:** upload each image from `steam-store/` into its matching slot, as listed in `STORE_PAGE.md`.
4. **Screenshots:** the 5 files in `steam-store/screenshots/`.
5. **Content survey, system requirements, pricing:** as listed in `STORE_PAGE.md`.
6. **Library assets** (under Graphical Assets → Library): capsule, header, hero, logo.
7. **Submit for review.** Then submit the build for review from the **Release** tab checklist.

Once the store page is approved, click **Coming Soon** to make it public, and start the two-week clock. Share the link to collect wishlists.

---

## Step 6 — Release

After the 30-day wait is over, the page has been Coming Soon for 2 weeks, and both reviews are approved, go to the **Release** tab and press **Release App**.

---

## Updating the game later

1. Change `index.html` (or anything in `desktop/`).
2. Raise `"version"` in `desktop/package.json`, and update `"Desc"` in `steam-upload/app_build.vdf`.
3. Run `npm run dist:win`, then `upload.bat`, then set the new build live in **SteamPipe → Builds**.

## Optional extras

- **Steam Deck:** the Windows build runs through Proton. You can request Deck verification in Steamworks once released. Full controller support would help it pass.
- **Linux build:** on Linux or WSL, run `npm install` and `npm run dist:linux`, add a Linux depot and launch option (`crosswind`), and add a `linux-unpacked\*` mapping to `app_build.vdf`.
- **Achievements:** the Steam library supports them. Ask if you'd like some added (first gunship kill, 10 nm, and so on).
