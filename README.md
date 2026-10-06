# Small Game

Two small browser games. Each is a single HTML file, so there's nothing to install.

## Crosswind — `index.html`

Fly a plane through a storm, steer around the lightning cells, and grab fuel cans before the tank runs dry. The storm speeds up the farther you go.

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

Turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root). Crosswind is at the site root and Relic Duel is at `/duel/`.
