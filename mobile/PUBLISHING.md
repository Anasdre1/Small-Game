# Publishing Crosswind on the App Store and Google Play

This folder holds the iPhone/iPad and Android apps for Crosswind. Both are built with [Capacitor](https://capacitorjs.com), which wraps the same game file (`index.html` in the repo root) in a native app.

```
mobile/
  capacitor.config.json   app ID, name, splash settings
  src/app.js              leaderboard (Firebase) + native behaviour (back button, pause, status bar)
  android/                Android Studio project (targets Android 16 / API 36)
  ios/                    Xcode project (iOS 15+, Swift Package Manager, no CocoaPods)
  assets/                 source icon and splash images
  store/                  screenshots, feature graphic, LISTING.md (all store text)
../firebase/              leaderboard security rules
../firebase-config.js     paste your Firebase config here
../privacy.html           privacy policy (hosted by GitHub Pages)
```

The app ID is `com.anasdre1.crosswind`. You can change it before your first upload, but never after; see "Changing the app ID" at the bottom.

---

## What you need

| | iPhone / iPad | Android |
|---|---|---|
| Developer account | [Apple Developer Program](https://developer.apple.com/programs/), $99/year | [Google Play Console](https://play.google.com/console/signup), $25 once |
| Computer | A Mac with **Xcode 26 or later** (required for uploads since April 28, 2026) | Mac, Windows or Linux with the latest **Android Studio** |
| Also | [Node.js](https://nodejs.org) 20 or later | Node.js 20 or later |

Expect Apple and Google to take a few days to verify a new developer account.

---

## Step 1 — Turn on the online leaderboard (Firebase, free)

1. Go to the [Firebase console](https://console.firebase.google.com) and **create a project** called `crosswind`. Google Analytics is not needed; turn it off.
2. **Add a Web app** (the `</>` icon on the project overview). Name it `Crosswind`. Skip hosting.
3. Firebase shows a `firebaseConfig = { ... }` block. Open `firebase-config.js` in the repo root and replace `window.CROSSWIND_FIREBASE = null;` with:
   ```js
   window.CROSSWIND_FIREBASE = {
     apiKey: "…", authDomain: "…", projectId: "…",
     storageBucket: "…", messagingSenderId: "…", appId: "…"
   };
   ```
   These values are safe to publish. The security rules decide what anyone can do.
4. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
5. **Build → Firestore Database → Create database.** Pick a location near your players (it can't be changed later) and start in **production mode**.
6. In Firestore, open the **Rules** tab, delete what's there, paste the contents of `firebase/firestore.rules`, and click **Publish**.
   - Optional: use the Rules **Playground** to try a write to `/scores/{your-test-uid}` with "Authenticated" checked, to see the rules accept a valid score and reject a fake one.
7. Don't add "HTTP referrer" restrictions to the API key in Google Cloud. The apps load from `capacitor://localhost` (iOS) and `https://localhost` (Android), and referrer limits would block them.
8. Recommended later: **App Check** (Build → App Check) adds another layer against fake scores. It needs native setup in each app, so it's optional for launch.

Every score is one document at `scores/{playerId}`. Each player can only write their own entry and can't lower it. The rules also reject names outside 2–14 letters and numbers, and scores too high for the run's distance and kills.

**Moderating names:** reports from the ⚑ button land in the `reports` collection. Open the reported player's `scores/{id}` document and delete it.

---

## Step 2 — Build the apps

From the `mobile` folder:

```bash
npm install
npm run sync      # bundles the leaderboard code, copies the game into www/, updates both native projects
```

Run `npm run sync` again any time you change `index.html`, `firebase-config.js` or `mobile/src/app.js`.

**Try it on Android:** `npm run android` opens Android Studio. Pick an emulator or a plugged-in phone and press **Run ▶**.

**Try it on iPhone (Mac only):** `npm run ios` opens Xcode. Pick a simulator and press **Run ▶**. To run on your own iPhone, choose your team under **Signing & Capabilities** first.

Check that the game plays in landscape, that **Post** puts your score on the board, and that the Android back button pauses the game.

---

## Step 3 — Host the privacy policy (GitHub Pages)

Both stores require a privacy policy URL.

1. Open `privacy.html` and replace `[YOUR CONTACT EMAIL]` with an email you're happy to make public. Commit and push.
2. On GitHub: **Small-Game → Settings → Pages → Deploy from a branch → `main` / root → Save.**
3. After a minute the policy is live at `https://anasdre1.github.io/Small-Game/privacy.html`. The web version of the game is at `https://anasdre1.github.io/Small-Game/`.

---

## Step 4 — Publish on Google Play

### Build the release file

1. In `android/app/build.gradle`, set `versionCode` (a whole number that goes up by 1 every upload) and `versionName` (what players see, like `1.0`).
2. Android Studio → **Build → Generate Signed App Bundle or APK → Android App Bundle**.
3. Choose **Create new** keystore. Save the `.jks` file and both passwords somewhere safe, like a password manager **and** a backup. You need them for every future update.
4. Pick **release** and finish. The file is at `android/app/release/app-release.aab`.

### Set up the app in Play Console

1. **Create app** → name *Crosswind*, Game, Free.
2. Work through the **Dashboard → Set up your app** tasks, copying answers from `store/LISTING.md`:
   - Privacy policy URL
   - App access: all features available without sign-in
   - Ads: no
   - Content rating questionnaire
   - Target audience: 13+
   - Data safety
3. **Grow → Store presence → Main store listing:**
   - Short and full description from `LISTING.md`
   - App icon: `store/play-icon-512.png`
   - Feature graphic: `store/feature-graphic.png`
   - Phone screenshots: `store/screenshots/android-phone-*.png`

### Release

- **New personal developer accounts must run a closed test first.** For accounts made after November 13, 2023, at least **12 testers** have to opt in and use the app for **14 days in a row** before you can apply for production. Friends, classmates and coworkers work. Organization accounts and older accounts skip this.
  1. **Test and release → Testing → Closed testing → Create track.** Upload the `.aab`, add your testers' Gmail addresses, and send them the opt-in link.
  2. After 14 days, go to **Dashboard → Apply for production** and answer the questions about your test.
  3. When approved, **Production → Create new release.** Upload the `.aab` (or promote the tested one) and roll out.
- Accept **Play App Signing** when asked. Google then holds the final signing key, and your keystore becomes the "upload key".

Google requires new apps and updates to target Android 16 (API 36) from August 31, 2026. This project already does.

---

## Step 5 — Publish on the App Store (Mac required)

### Register the app

1. [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list) → **+** → App IDs → App → Bundle ID `com.anasdre1.crosswind`, description *Crosswind*. No extra capabilities are needed.
2. [App Store Connect](https://appstoreconnect.apple.com) → **Apps → + → New App**:
   - Platform iOS, name *Crosswind*, language English
   - The bundle ID from above
   - SKU `crosswind`

### Upload a build

1. `npm run sync`, then `npm run ios` to open Xcode.
2. Select the **App** target → **Signing & Capabilities** → tick *Automatically manage signing* and pick your team.
3. Under **General**, set *Version* (`1.0`) and *Build* (`1`, and raise it on every upload).
4. Choose **Any iOS Device (arm64)** as the run destination, then **Product → Archive**.
5. In the Organizer: **Distribute App → App Store Connect → Upload.**
6. After processing (about 15 minutes), the build shows up under **TestFlight**. Install it on your phone with the TestFlight app and play a round.

### Fill in the listing and submit

From `store/LISTING.md`:

- **App Information:** subtitle, category (Games → Action), privacy policy URL.
- **App Privacy:** the three data types listed, all *not linked to you* and *not used for tracking*.
- **Age rating questionnaire:** mild cartoon violence; user-generated content yes (nicknames, filtered and reportable).
- **Version page:**
  - Description, keywords and support URL
  - iPhone 6.9" screenshots from `store/screenshots/iphone-6.9-*.png`
  - iPad 13" screenshots from `store/screenshots/ipad-13-*.png`
  - Select the build
- **Review notes:** "No login needed. Tap Take Off to play. The leaderboard uses anonymous sign-in; nicknames are filtered and can be reported with the flag button."
- **Add for Review → Submit.** Reviews usually take one to three days.

The app declares that it uses no non-exempt encryption, so you won't get the export compliance question on each build.

---

## Updating the game later

1. Change `index.html` (or anything above), then from `mobile/` run `npm run sync`.
2. Raise the version numbers: Android `versionCode` + `versionName`; iOS *Version* + *Build*.
3. Build and upload as in Steps 4 and 5. On Play, updates go straight to production once your app is live.

To regenerate icons after changing `assets/icon-only.png`, run `npm run assets`.

## Changing the app ID

Only possible before the first upload to either store. Replace `com.anasdre1.crosswind` with your new ID in:

- `capacitor.config.json`
- `android/app/build.gradle` (`namespace` and `applicationId`)
- The Java package folder under `android/app/src/main/java/`
- Xcode → App target → *Bundle Identifier*

Then run `npm run sync`.
