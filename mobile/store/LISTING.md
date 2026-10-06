# Store listing — copy and paste

Everything you'll be asked to type into App Store Connect and Google Play Console.

## Basics

| Field | Value |
|---|---|
| App name | Crosswind |
| iOS subtitle (30 chars max) | Storm dogfight & leaderboard |
| Play short description (80 chars max) | Fly through the storm, shoot down raiders and climb the worldwide leaderboard. |
| Category | Games → Action (iOS) / Game → Arcade (Play) |
| Price | Free |
| Bundle ID / package name | `com.anasdre1.crosswind` |
| Privacy policy URL | `https://anasdre1.github.io/Small-Game/privacy.html` (after you turn on GitHub Pages) |
| Support URL | `https://github.com/Anasdre1/Small-Game` |
| iOS keywords (100 chars max) | `plane,jet,storm,arcade,shooter,flying,pilot,dogfight,leaderboard,highscore,retro,endless` |
| Copyright | 2026 Anas Deree |

## Full description (both stores)

```
Take the controls and fly into the storm.

Crosswind is a fast arcade flyer. Your guns fire automatically, so all you do is steer: slide your finger up and down to dodge lightning cells, line up shots on enemy aircraft, and grab fuel before your tank runs dry.

ENEMIES THAT GET TOUGHER
• Raiders dive in fast, sometimes in pairs
• Weavers zigzag across your path
• Gunships stop to fight and fire back

POWERUPS
• Shield blocks every hit for 6 seconds
• Spread shot fires three ways
• Rapid fire shreds anything in front of you
• Repair kits patch your hull
• Fuel cans keep you in the air

WORLDWIDE LEADERBOARD
Post your best run under a nickname and see how you stack up against pilots on iPhone, iPad, Android and the web.

No ads. No in-app purchases. No account needed.
```

## What's new (version 1.0)

```
First release.
```

## Screenshots and graphics

All in `mobile/store/`:

| Store | Slot | Files |
|---|---|---|
| App Store | iPhone 6.9" display | `screenshots/iphone-6.9-*.png` (2868 × 1320) |
| App Store | iPad 13" display | `screenshots/ipad-13-*.png` (2752 × 2064) |
| Google Play | Phone screenshots | `screenshots/android-phone-*.png` (2340 × 1080) |
| Google Play | App icon (512 × 512) | `play-icon-512.png` |
| Google Play | Feature graphic (1024 × 500) | `feature-graphic.png` |

The leaderboard screenshots use sample player names, since the real board starts empty.

## Age rating questionnaires

Answer honestly; these are the answers that match the game as built.

- **Violence:** cartoon or fantasy violence, infrequent/mild (you shoot down abstract enemy aircraft that burst into particles; no people, no blood).
- **User-generated content:** yes, limited. Players can choose a nickname shown on a leaderboard. Names are filtered, players can report names, and you can delete entries.
- **Players can communicate with each other:** no (no chat or messages).
- **Shares location:** no. **Ads:** no. **In-app purchases:** no. **Gambling:** no. **Web browsing:** no.

Expected result: about 9+ on the App Store and Everyone 10+ on Google Play.

## App Store — App Privacy ("nutrition label")

Data collection: **Yes, data is collected.**

| Data type | Used for | Linked to the user? | Used for tracking? |
|---|---|---|---|
| Identifiers → User ID (anonymous Firebase ID) | App Functionality | No | No |
| User Content → Other User Content (nickname) | App Functionality | No | No |
| Usage Data → Gameplay Content (score, kills, distance) | App Functionality | No | No |

## Google Play — Data safety

- Does your app collect or share user data? **Yes, collects.** Shares: **No.**
- Is all collected data encrypted in transit? **Yes** (Firebase uses HTTPS).
- Can users request deletion? **Yes**, by contacting you (see the privacy policy).
- Data types collected:
  - **App activity → Other user-generated content** (nickname): collected, not shared, required for the leaderboard, purpose *App functionality*.
  - **App activity → Other actions** (scores): collected, not shared, purpose *App functionality*.
  - **Device or other IDs** (anonymous Firebase ID): collected, not shared, purpose *App functionality*.

## Other Play Console declarations

- **Ads:** no ads. **Target audience:** 13 and over (choosing under-13 adds Families policy requirements). **News app:** no. **Government app:** no. **Financial features:** none. **Health:** none.
- **App access:** all features are available without signing in.
