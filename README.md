# Small Game

Two small browser games. Each is a single HTML file, so there's nothing to install.

Crosswind is also packaged for other platforms:

- **Steam (Windows):** `desktop/`, with Steam's built-in leaderboard. See [`desktop/STEAM.md`](desktop/STEAM.md).
- **iPhone/iPad and Android:** `mobile/`, with a shared online leaderboard on Firebase. See [`mobile/PUBLISHING.md`](mobile/PUBLISHING.md).

## Crosswind — `index.html`

Fly a plane through a storm. Your guns fire automatically: shoot down enemy aircraft, dodge the lightning cells, and keep your fuel up. You can take 3 hits.

**Enemies** (they unlock as you fly farther):
- Raiders: fast, fly straight, sometimes in pairs.
- Weavers: take 2 hits, weave up and down.
- Gunships: take 5 hits, slow down to fight, and fire 3-shot bursts at you.

**Powerups:**
- Fuel (F): refills the tank.
- Shield (S): blocks all hits for 6 seconds.
- Spread shot (3): fires 3 ways for 8 seconds.
- Rapid fire (R): fires much faster for 8 seconds.
- Repair (+): restores 1 hull point.

Score comes from distance, kills and pickups. After a run you can post your best score to the online leaderboard under a nickname (once Firebase is set up; see `mobile/PUBLISHING.md`).

| Action | Keyboard | Phone / tablet |
|---|---|---|
| Climb / descend | `↑` `↓` or `W` `S` | Drag up and down |
| Pause | `P` | — |
| Start / restart | `Enter` | Tap the button |

## Relic Duel — `duel/index.html`

A classic-style monster card duel for two players on one device. Players take turns, and a pass screen hides your hand between turns.

- Each player starts with 8000 Life Points and a 30-card deck, and draws 5 cards.
- Summon one monster per turn, face-up in Attack Position or face-down in Defense Position. Level 5–6 monsters need 1 tribute; level 7 and up need 2.
- In the Battle Phase, each face-up Attack Position monster can attack once. There are no attacks on the first turn.
- When two Attack Position monsters fight, the weaker one is destroyed and its owner takes the difference in damage. Attacking a Defense Position monster deals no damage unless its DEF is higher than your ATK.
- Spells: draw cards, heal, deal damage, destroy monsters, power up a monster, or revive one from the graveyard.
- Traps: set them face-down, and you'll be asked whether to spring them on your opponent's turn.
- Hand limit is 6. Reduce your opponent to 0 Life Points to win.

All card names and art are original.

## Play online

Turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). Crosswind is at the site root, Relic Duel is at `/duel/`, and the app privacy policy is at `/privacy.html`.
