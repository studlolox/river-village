# PLAN.md — River Village phased build plan

Build order follows dependency and playable-value slices: **tooling & sim/render architecture → playable farming vertical slice → world & animals → mining, combat & upgrades → fishing, crafting & cooking → villagers → audio/polish (v1.0) → festivals, marriage & arcade (v1.1 / full 57-feature completion)**.

Each phase ends only when:
1. Every `SPEC` test assigned to that phase passes headlessly.
2. The build runs offline in a mobile viewport (`375×812` touch) without console errors.
3. The automated IP/naming check passes against `src/assets/names.json`.

---

## Cross-cutting architecture & production rules

Before Phase 0 code is written, every phase adheres to these foundations:

1. **Simulation vs. Renderer split:**
   - `src/js/sim/` holds pure deterministic game state (`Game`, `Holding`, `Farm`, `Mine`, `Villager`, `TimeOfDay`, `Inventory`, `SaveManager`) with zero `three` or DOM imports so all 57 `SPEC` tests run fast and headlessly.
   - `src/js/render/` holds the three.js isometric scene, camera, `THREE.InstancedMesh` / chunked tile geometry, texture atlases, particles, and touch/keyboard input adapters.
   - `src/js/ui/` holds mobile-first HUD, modals, and ≥44×44 CSS px touch controls.
2. **Offline-first bundling & cache budget:**
   - Local `package.json` with a bundler (e.g., Vite) bundling `three` locally (zero CDN dependencies) and generating the precache list for `sw.js`.
   - Total PWA precache budget: **≤ 30 MB** (WebP/PNG atlases, OGG/MP3 audio) so mobile browsers do not evict offline assets.
3. **Asset conversion & IP compliance pipeline:**
   - Scripts convert `extracted-assets/` (XNB/.xwb/.xsb) into web formats under `src/assets/` using original filenames only.
   - Canonical registries live in `src/assets/names.json`, `src/assets/items.json`, and `src/assets/ATTRIBUTION.md`.
   - A test/lint script scans `src/` and `src/assets/` for forbidden reference names starting in Phase 0.
4. **Versioned saves (`schemaVersion`):**
   - `SaveManager` stores compact JSON with `schemaVersion`, sparse tile/world diffs, and per-version migration hooks to fit safely within mobile `localStorage` limits.
5. **Mobile-first isometric ergonomics:**
   - Target-tile highlight reticle in front of the player, virtual D-pad + tap-to-walk/tap-to-interact support, and safe-area inset handling (`env(safe-area-inset-*)`).

---

## Phase 0 — Foundation, tooling & offline shell (weeks 1–2)

Goal: repository tooling, `sim/` vs `render/` architecture, asset/IP pipeline, runnable offline PWA shell with isometric three.js world, movement, time, and versioned save/load.

Features:
- FV-001 PWA shell → SPEC-FV-001
- FV-002 Responsive mobile-first UI → SPEC-FV-002
- FV-003 Settings panel → SPEC-FV-003
- FV-004 Save / load → SPEC-FV-004
- FV-010 Character creation → SPEC-FV-010
- FV-011 Player bedroom / sleep → SPEC-FV-011
- FV-012 Holding map → SPEC-FV-012
- FV-020 Tile-based movement → SPEC-FV-020
- FV-022 Day/night cycle → SPEC-FV-022

Milestone M0: player can start a new game, name character + holding, walk around the holding via touch D-pad/tap or WASD with a visible target-tile reticle, sleep to advance days, save/load across reloads, and install/run offline. Placeholder art and early audio-unlock/SFX stub wired.

Deliverables:
- `package.json`, bundler config, headless test runner + Playwright 375×812 smoke test, IP/name-lint check
- `src/index.html`, `src/manifest.webmanifest`, `src/sw.js`
- `src/assets/names.json`, `src/assets/items.json`, `src/assets/ATTRIBUTION.md`, asset conversion script for `extracted-assets/`
- `src/js/sim/`: `game.js`, `world.js`, `holding.js`, `player.js`, `time.js`, `save.js` (with `schemaVersion`), `settings.js`
- `src/js/render/`: `scene.js`, `tile-renderer.js` (`InstancedMesh`/atlas), `input.js` (touch + desktop), `audio-stub.js`
- `src/tests/*.test.js` for all Phase 0 features, all passing

---

## Phase 1 — Playable vertical slice: farming, energy & market (weeks 3–5)

Goal: a genuinely fun, tactile core farming loop with stamina, economy, starter village shop presence, and early juice (placeholder tool SFX + watering/harvest particles) — plus a mobile playtest & tuning pass in week 5.

Features:
- FV-030 Tilling soil → SPEC-FV-030
- FV-031 Planting crops → SPEC-FV-031
- FV-032 Watering → SPEC-FV-032
- FV-033 Crop growth stages → SPEC-FV-033
- FV-034 Harvesting → SPEC-FV-034
- FV-055 Health & energy (Part 1: Energy bar, tool stamina cost, sleep/food restore; HP & Clinic added in Phase 4) → SPEC-FV-055 (energy subset)
- FV-083 Shipping bin → SPEC-FV-083
- FV-084 Reed's Market (including Maren Reed shopkeeper NPC & shop hours) → SPEC-FV-084
- FV-085 Inventory (tool belt, stackable items, starter chest at the holding) → SPEC-FV-085
- Early plumbing for FV-131 (placeholder tool/UI SFX) and FV-132 (watering/harvest particles)

Milestone M1 (**Playable Vertical Slice**): player tills, plants, waters (spending energy), watches crops grow across days, harvests, stores items in a starter chest, ships produce for gold, and buys seeds from Maren Reed at Reed's Market — verified on a 375px touch device for responsiveness and fun.

Deliverables:
- `src/js/sim/`: `farm.js`, `crop.js`, `inventory.js`, `chest.js`, `shop.js`, `shipping.js`, `energy.js`
- `src/js/render/`: crop stage sprites/meshes, minimal `particles.js` and `audio.js` hooks
- `src/assets/crops.json` (original crop definitions synced with `items.json`)
- All Phase 1 SPEC tests passing + week 5 mobile UX & economy tuning pass

---

## Phase 2 — World, regions, seasons & foraging (weeks 6–7)

Goal: travel beyond the holding across River Village, beach, forest, and mountains; seasons/weather; foraging; trees/debris clearing and regeneration.

Features:
- FV-021 Region travel → SPEC-FV-021
- FV-023 Seasons & weather → SPEC-FV-023
- FV-070 Forageables → SPEC-FV-070
- FV-071 Trees & debris → SPEC-FV-071
- FV-072 Resource regeneration → SPEC-FV-072

Milestone M2: player travels seamlessly between Holding, River Village, Beach, Forest, Mountains, and the Deep Warrens entrance; chops trees, breaks stones, gathers seasonal forage, and sees rain auto-water outdoor crops and seasonal palettes shift.

Deliverables:
- `src/js/sim/`: `region.js`, `weather.js`, `forage.js`, `season.js`, `debris.js`
- Original region tilemaps in `src/assets/maps/` (Holding, River Village, Beach, Forest, Mountains; no reference-map copies)
- All Phase 2 SPEC tests passing

---

## Phase 3 — Animals & holding buildings (weeks 8–9)

Goal: barn/coop placement, buying and caring for original animals, daily products, affection/quality progression, and animal naming.

Features:
- FV-040 Barn & coop buildings → SPEC-FV-040
- FV-041 Purchasing animals → SPEC-FV-041
- FV-042 Animal care → SPEC-FV-042
- FV-043 Animal happiness → SPEC-FV-043
- FV-044 Animal naming → SPEC-FV-044

Milestone M3: player places a barn/coop on holding plots, buys original animals at Reed's Market, names them, feeds hay/pets daily, and collects quality-scaled products.

Deliverables:
- `src/js/sim/`: `animal.js`, `building.js`
- `src/assets/animals.json`
- All Phase 3 SPEC tests passing

---

## Phase 4 — Deep Warrens: mining, combat, loot & blacksmith upgrades (weeks 10–12)

Goal: cohesive dungeon-to-tool-upgrade loop — generated mine floors, ore nodes, monsters, combat, HP/Clinic defeat, monster loot, geodes, and Blacksmith tool upgrades (including 3×3 hoe/watering can). Week 12 includes combat feel and dungeon balance QA.

Features:
- FV-050 Mine entrance → SPEC-FV-050
- FV-051 Mining nodes → SPEC-FV-051
- FV-052 Monsters → SPEC-FV-052
- FV-053 Combat → SPEC-FV-053
- FV-054 Mine floors & ladders → SPEC-FV-054
- FV-055 Health & energy (Part 2: full HP, damage, 0 HP → Clinic wake-up) → SPEC-FV-055
- FV-120 Monster roster (Puddle, Glop, Bat, Dust Spirit, Cave Crab, Serpent) → SPEC-FV-120
- FV-121 Loot drops → SPEC-FV-121
- FV-122 Geodes → SPEC-FV-122
- FV-080 Tool upgrades (Blacksmith NPC/shop using ore + gold) → SPEC-FV-080
- FV-035 Crop tool upgrades (3×3 hoe/watering can unlocked via FV-080) → SPEC-FV-035

Milestone M4: player enters the Deep Warrens, mines copper/iron/gold, fights original monsters with sword/slingshot, collects loot and geodes, descends via ladders and 5-floor checkpoints, wakes at the Clinic at 0 HP, cracks geodes, and upgrades tools at the Blacksmith (unlocking 3×3 tilling/watering).

Deliverables:
- `src/js/sim/`: `mine.js`, `monster.js`, `combat.js`, `health.js`, `loot.js`, `geode.js`, `blacksmith.js`
- `src/assets/monsters.json`, `src/assets/loot.json`
- All Phase 4 SPEC tests passing + combat/hit-flash/knockback mobile playtest

---

## Phase 5 — Fishing, crafting & cooking (weeks 13–14)

Goal: original timing-based fishing system, fishing progression, craftable machines/storage, and kitchen cooking for energy/HP recovery.

Features:
- FV-060 Fishing spots → SPEC-FV-060
- FV-061 Fishing minigame (shared implementation with FV-110) → SPEC-FV-061
- FV-062 Fishing levels → SPEC-FV-062
- FV-081 Crafting menu → SPEC-FV-081
- FV-082 Cooking → SPEC-FV-082

Milestone M5: player fishes at river/beach/mountain lake via an original touch-friendly timing minigame, levels fishing skill for better rods, crafts chests/fences/kegs/sprinklers, and cooks dishes that restore energy and HP.

Deliverables:
- `src/js/sim/`: `fishing.js`, `fishing-minigame.js`, `crafting.js`, `kitchen.js`
- `src/assets/fish.json`, `src/assets/recipes.json`
- All Phase 5 SPEC tests passing

---

## Phase 6 — Core villagers, relationships & mail (weeks 15–17)

Goal: bring River Village to life with scheduled villagers, context-aware dialogue, gifting/friendship progression, and mailbox letters. (Starts with core town NPCs and scales up to the full roster.)

Features:
- FV-090 Villagers (schedules, homes, workplaces; core 6 villagers first, expanding to 10) → SPEC-FV-090
- FV-091 Dialogue (varies by day, season, weather, friendship) → SPEC-FV-091
- FV-092 Friendship (0–10 hearts) → SPEC-FV-092
- FV-093 Gifts (love/like/neutral/dislike reaction tables) → SPEC-FV-093
- FV-102 Mail system (letters, gifts, invitations at holding mailbox) → SPEC-FV-102

Milestone M6 (**v1.0 Feature-Complete Candidate**): villagers follow daily schedules around town, respond with dynamic dialogue and gift reactions, build friendship hearts, and send mail to the holding.

Deliverables:
- `src/js/sim/`: `villager.js`, `schedule.js`, `dialogue.js`, `friendship.js`, `mail.js`
- `src/assets/villagers.json`
- All Phase 6 SPEC tests passing

---

## Phase 7 — Audio, particles & v1.0 release polish (weeks 18–19)

Goal: replace placeholder audio/effects with full original music per region/season, full SFX coverage, rich particles, mobile performance optimization, and offline PWA QA for **River Village v1.0**.

Features:
- FV-130 Music → SPEC-FV-130
- FV-131 Sound effects → SPEC-FV-131
- FV-132 Particle effects → SPEC-FV-132
- Final polish & device QA on FV-001..FV-004 (installability, offline cache ≤ 30 MB, 375px layout, save migration verification)

Milestone M7 (**River Village v1.0 Ship Gate**): complete core farm-life loop (farming, seasons, animals, Deep Warrens, fishing, crafting/cooking, villagers, mail, full audio/particles), playable offline on mobile PWA and desktop.

Deliverables:
- Final `src/js/render/audio.js`, `src/js/render/particles.js`
- Original/converted OGG/MP3 audio in `src/assets/audio/`
- Precache audit + mobile hardware QA sign-off

---

## Phase 8 — Expansion / v1.1 content: marriage, festivals & arcade (weeks 20–24)

*Note: Can ship as v1.1 post-launch or merge into v1.0 if Phases 0–7 finish ahead of schedule.*

### Sub-phase 8A — Full roster, marriage & heart/birthday events (weeks 20–21)
- FV-090 expansion to full 10 original villagers → SPEC-FV-090
- FV-094 Marriage (10-heart proposal with original pendant, spouse moves to holding) → SPEC-FV-094
- FV-101 Villager events (heart events & birthdays) → SPEC-FV-101
- Deliverables: `src/js/sim/marriage.js`, `src/js/sim/events.js`

### Sub-phase 8B — Season festivals & saloon arcade (weeks 22–24)
- FV-100 Season festivals (Spring Egg Hunt, Summer Luau, Fall Fair, Winter Feast) → SPEC-FV-100
- FV-110 Fishing minigame (festival contest integration) → SPEC-FV-110
- FV-111 Festival games → SPEC-FV-111
- FV-112 Arcade at the saloon → SPEC-FV-112
- Deliverables: `src/js/sim/festival.js`, `src/js/sim/festival-games.js`, `src/js/sim/arcade.js`, `src/assets/festivals.json`

Milestone M8 (**Full 57-Feature Completion**): all 10 villagers, marriage, birthdays/heart events, 4 seasonal festivals, and the saloon arcade cabinet playable and tested.

---

## Release checklist — Full River Village

- All **57** `SPEC` tests (`FV-001` through `FV-132`) pass in `src/tests/<feature-id>.test.js`
- Mobile-first verified on `375×812`+ touch viewports (all interactive targets ≥44×44 CSS px, no hover-only interactions)
- PWA installs and runs 100% offline with precache within budget (≤ 30 MB)
- Original names only (automated check against `src/assets/names.json`)
- No reference-game source formats (`.xnb`, `.xwb`, `.xsb`) or unattributed assets in `src/assets/`

## Naming reminder

Every character, place, creature, crop, item, and festival introduced in any phase must use an original River Village name registered in `src/assets/names.json`. No reference-game names anywhere in code, dialogue, UI, or assets.
