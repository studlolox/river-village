# PLAN.md — River Village phased build plan

Build order follows dependency, risk-retirement, and playable-value slices: **tooling, spec alignment & `sim/`/`render/` architecture → playable farming vertical slice + FTUE & economy → world, seasons, foraging, basic crafting & dev console → animals → Deep Warrens mining, combat & upgrades → fishing, advanced crafting & cooking → villagers & mail → original music/polish (v1.0) → marriage, festivals & arcade (v1.1 / full 58-feature completion)**.

Each phase ends only when:
1. Every `SPEC` test assigned to that phase passes (Vitest for pure `sim/`, Playwright Chromium for layout/PWA/E2E).
2. Cross-phase integration & save-migration checks pass without regression.
3. The build runs offline in mobile portrait (`375×812`) and landscape (`812×375`) touch viewports with zero console errors and within render/cache budgets.
4. The automated IP/naming and asset-provenance check passes against `src/assets/names.json` and `src/assets/ATTRIBUTION.md`.

---

## Cross-cutting architecture & production rules

Before Phase 0 code is written, every phase adheres to these foundations:

1. **Simulation vs. Renderer split & Unified `Game` Domain Contract:**
   - `src/js/sim/` holds pure deterministic game state coordinated under a unified `Game` root (`time`, `world`, `holding`, `mine`, `player`, `inventory`, `economy`, `npcs`, `quests`) with zero `three` or DOM imports so headless `SPEC` tests run fast and deterministically.
   - Standalone classes referenced in `SPEC.md` (`Holding`, `Farm`, `Mine`, `World`, `Villager`, `TimeOfDay`, `Inventory`, `SaveManager`) act as cleanly wired subsystems or thin facades over the shared state contract—never isolated silos.
   - `src/js/render/` holds the `three.js` 2.5D scene, camera, `THREE.InstancedMesh` / merged static region chunks, materials/atlases, particles, Web Audio engine, and touch/keyboard input adapters.
   - `src/js/ui/` holds mobile-first HUD, modals, safe-area layout, and ≥44×44 CSS px touch controls.
2. **Original IP, 3D Visual Direction & Audio Strategy:**
   - **Study-only reference rule:** `extracted-assets/` is used strictly for proportion, timing, and palette reference—never ship copyrighted `.xnb`/`.xwb`/`.xsb` textures or SFX in production. Note also that `music.xwb` is excluded from `extracted-assets/` and `dotnet`/`mono`/`magick` are not present locally.
   - **3D-native original visuals:** Build original stylized low-poly 3D meshes + procedural/authored canvas textures (and `alphaTest: 0.5` cutouts where sprites are used—avoid semi-transparent sprite billboards inside `InstancedMesh` to prevent alpha-sorting bugs).
   - **Original audio from Phase 1 onward:** Use Web Audio API procedural synthesis and/or documented CC0 OGG/MP3 files under `src/assets/audio/` with attribution in `src/assets/ATTRIBUTION.md`.
   - **Canonical registries & automated lint:** `src/assets/names.json`, `src/assets/items.json`, `src/assets/economy.json`, and `src/assets/ATTRIBUTION.md` are checked by a Phase 0 lint script scanning `src/` and `src/assets/` for forbidden reference names.
3. **Mobile-first Camera, Touch Ergonomics & OS Lifecycle:**
   - **2.5D `OrthographicCamera`:** Screen-aligned cardinal movement (zero perspective edge warping; if angled rotation is used, `render/input.js` rotates thumbstick vectors relative to camera while `sim/` keeps canonical grid axes).
   - **Mobile control scheme:** Left **floating virtual thumbstick** + right **primary Action button** + 4-slot quick-bar, paired with **tap-on-tile smart interaction** (walk-if-needed + context tool/harvest) and **hold-and-drag chaining** across adjacent farm tiles, plus visible target-tile reticle.
   - **Browser & iOS/Android PWA guards:** `env(safe-area-inset-*)`, `touch-action: none` (prevent pinch-zoom/pull-to-refresh), `AudioContext` unlock on first `pointerdown`, and an inline iOS Safari "Add to Home Screen" prompt fallback (since iOS lacks `beforeinstallprompt`).
   - **Auto-pause on `visibilitychange`:** Immediately pauses the `requestAnimationFrame` loop and in-game day clock when backgrounded or when modals/inventory/dialogue are open.
4. **Mobile Performance, Precache & Storage Budgets:**
   - **Render budget:** Cap `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` (plus a Battery/Quality toggle in Settings), target **< 50 draw calls** per region, and maintain **zero per-frame heap allocations** inside the render loop.
   - **Offline bundle budget:** Clean `package.json` + Vite + `vite-plugin-pwa` (or deterministic precache generator) bundling `three` locally (zero CDNs). Total precache budget **≤ 30 MB** (safe within iOS Safari's ~50 MB origin limit).
   - **Versioned compact saves (`schemaVersion`):** `SaveManager` stores compact RLE/sparse tile diffs with `schemaVersion`, migration hooks, and non-blocking confirmation state (`confirmDelete`) safely under mobile `localStorage` limits (~5 MB cap, explicitly size-tested).
5. **Dual Test Harness & Cross-System Integration Suite:**
   - Vitest runs pure headless `sim/` `SPEC-FV-*` tests; Playwright Chromium runs DOM/layout/PWA specs (`FV-001`, `FV-002`) and mobile `375×812` + `812×375` smoke flows.
   - A separate integration suite (`src/tests/integration/`, alongside the 58 `SPEC-FV-###.test.js` files) verifies multi-system flows (save/load migrations, season rollovers, clinic wake-up, shipping payouts) and runs a headless 1-year economy simulator.

---

## Phase 0 — Tooling cleanup, spec alignment & offline 3D shell (weeks 1–2)

Goal: clean workspace baseline, reconcile `SPEC.md` contradictions, establish unified `sim/` vs `render/` architecture and IP-safe procedural art/audio pipeline, and deliver an offline installable PWA with 2.5D `three.js` world, movement, clock, and versioned save/load.

Pre-code alignment tasks:
- Clean stale untracked `dist/`/`node_modules/` remnants and initialize `package.json`, Vite, Vitest, Playwright, and the automated IP/name-lint check.
- Reconcile the 5 internal contradictions in `SPEC.md` before Phase 1 tests run:
  1. `SPEC-FV-032` vs `SPEC-FV-033` (unwatered crops don't grow vs watering once across 3 `advanceDay()` calls, plus calling `plant()` without tilling first).
  2. `SPEC-FV-042` vs `SPEC-FV-043` (`collectProduct()` returning string `'Egg'` vs `{ kind, quality }` object).
  3. `SPEC-FV-080` (prose specifies waiting period while snippet tests instant `tier === 2`).
  4. `SPEC-FV-041` header typo (`(FV-040)` → `(FV-041)`).
  5. `SPEC-FV-001`/`FV-002` browser execution environment (Playwright real layout & SW vs jsdom).

Features:
- FV-001 PWA shell → SPEC-FV-001 (Playwright Chromium + iOS A2HS fallback)
- FV-002 Responsive mobile-first UI → SPEC-FV-002 (375×812 portrait + 812×375 landscape)
- FV-003 Settings panel (audio, music, screen shake, battery/quality mode, original language strings, credits) → SPEC-FV-003
- FV-004 Save / load (3 slots, `schemaVersion`, compact sparse diffs, delete confirmation) → SPEC-FV-004
- FV-010 Character creation → SPEC-FV-010
- FV-011 Player bedroom / sleep → SPEC-FV-011
- FV-012 Holding map → SPEC-FV-012
- FV-020 Tile-based movement → SPEC-FV-020
- FV-022 Day/night cycle (6:00–02:00, configurable mobile day length, `visibilitychange` auto-pause) → SPEC-FV-022

Milestone M0: player starts a new game, names character + holding, walks via floating thumbstick, tap-to-walk, or WASD in an `OrthographicCamera` low-poly 3D holding with a target-tile reticle, sleeps to advance days, saves/loads compact versioned state across reloads, and installs/runs offline under budget.

Deliverables:
- Clean `package.json`, `vite.config.js`, Vitest + Playwright configs, IP/name-lint script
- `src/index.html`, `src/manifest.webmanifest`, `src/sw.js`
- `src/assets/names.json`, `src/assets/items.json`, `src/assets/ATTRIBUTION.md`
- `src/js/sim/`: `game.js` (unified root), `world.js`, `holding.js`, `player.js`, `time.js`, `save.js`, `settings.js`
- `src/js/render/`: `scene.js` (`OrthographicCamera`, DPR cap, `<50` draws), `tile-renderer.js` (`InstancedMesh`), `input.js` (floating thumbstick, tap-on-tile, WASD), `audio.js` (Web Audio unlock + synth foundation)
- `src/tests/*.test.js` for all Phase 0 features + `375×812` / `812×375` Playwright smoke test, all passing

---

## Phase 1 — Playable vertical slice: farming, FTUE, economy & juice (weeks 3–5)

Goal: a genuinely fun, responsive core farming loop with touch chaining, first-5-minutes onboarding, tuned economy balance sheet, starter Reed's Market loop, and real synthesized SFX + particles from day one—verified by a week 5 mobile playtest.

Features:
- FV-030 Tilling soil → SPEC-FV-030
- FV-031 Planting crops → SPEC-FV-031
- FV-032 Watering → SPEC-FV-032
- FV-033 Crop growth stages → SPEC-FV-033
- FV-034 Harvesting → SPEC-FV-034
- FV-055 Health & energy (Part 1: Energy bar, stamina costs, sleep/food restore; HP & Clinic in Phase 4) → SPEC-FV-055 (energy subset)
- FV-083 Shipping bin → SPEC-FV-083
- FV-084 Reed's Market (Maren Reed shopkeeper NPC, shop hours, seasonal stock) → SPEC-FV-084
- FV-085 Inventory (tool belt, stackable items, starter chest, quick-stack / deposit-all UX) → SPEC-FV-085
- Early active implementations of FV-131 (synthesized tool/soil/harvest/coin SFX) and FV-132 (dirt/water/harvest particles)

UX & Game-Design Additions in Phase 1:
- **FTUE Starter Onboarding:** Day 1 welcome note + 4-step guided checklist (till → plant free Spring Root seeds → water → ship 1 crop) so new players understand the loop in under 3 minutes.
- **Tap-on-tile smart farming & hold-drag chaining:** Tap adjacent tile to context-till/plant/water/harvest or drag across rows without rapid button mashing.
- **Economy & pacing model (`src/assets/economy.json`):** Define seed buy/sell curves, energy costs, and run a headless 1-year economy simulator to catch inflation/grind traps early.

Milestone M1 (**Playable Vertical Slice**): player completes the starter checklist, tills/plants/waters via smooth touch chaining (with snappy SFX and particles), sleeps to grow crops, quick-stores items in a chest, ships produce for gold, and buys seeds from Maren Reed—validated on a `375×812` touchscreen in <10 taps per plot.

Deliverables:
- `src/js/sim/`: `farm.js`, `crop.js`, `inventory.js`, `chest.js`, `shop.js`, `shipping.js`, `energy.js`, `onboarding.js`
- `src/js/render/`: procedural low-poly crop stage meshes, `particles.js`, expanded Web Audio synth cues in `audio.js`
- `src/assets/crops.json`, `src/assets/economy.json` + headless 1-year balance simulation script
- All Phase 1 SPEC tests passing + week 5 mobile UX & economy tuning pass

---

## Phase 2 — World, regions, seasons, foraging, basic crafting & dev console (weeks 6–7)

Goal: expand beyond the holding across River Village, beach, forest, mountains, and Deep Warrens entrance; seasonal weather & palette shifts; foraging/debris clearing; early Village Restoration milestone hooks; **Basic Crafting** (pulled forward so players get chests, fences, and basic sprinklers before Phase 3–4); and a **full Dev Console & Developer Mode (`FV-005`)** so devs can test every system rapidly on both desktop and mobile touch viewports.

Features:
- FV-005 Dev console & mode (gated via `?dev=1`, `localStorage` flag, 5-tap Settings version gesture, or `~` / `Ctrl+Shift+D`) → SPEC-FV-005
- FV-021 Region travel → SPEC-FV-021
- FV-023 Seasons & weather (rain auto-watering, storm/sunny states, seasonal visuals) → SPEC-FV-023
- FV-070 Forageables → SPEC-FV-070
- FV-071 Trees & debris → SPEC-FV-071
- FV-072 Resource regeneration → SPEC-FV-072
- FV-081 Crafting menu (Part 1: basic utility recipes—`Chest`, `Fence`, `Path`, `Basic Sprinkler`, `Furnace`) → SPEC-FV-081 (basic subset)

World & Progression Additions:
- **Village Restoration Ledger hooks:** Milestone delivery board in River Village linking regional materials/produce to landmark repairs (shortcuts/unlocks), giving mid-term direction.
- **Workplace NPC presence stubs:** Place non-scheduled shopkeeper avatars (Blacksmith, Clinic Doctor, Saloon Keeper) in their buildings so town feels inhabited prior to Phase 6 schedules.
- **Full Dev Console & Mode (`src/js/sim/dev.js` + `src/js/ui/dev-console.js`):**
  - **Economy & Items:** `addGold(amount)`, `setGold(amount)`, `giveItem(itemId, qty, quality)`, `clearInventory()`, `fillEnergy()`, `godMode(bool)` (infinite energy/HP).
  - **Time, Weather & World:** `setTime(hh, mm)`, `advanceDays(n)`, `setSeason(season)`, `setWeather(weather)`, `teleport(region, x, y)`, `growAllCrops()`, `waterAllCrops()`, `clearDebris()`.
  - **Storyline, Relationships & Achievements:** `completeOnboarding()`, `advanceStoryline(milestoneId)` / `unlockAllMilestones()`, `setFriendship(villagerId, hearts)` / `maxAllFriendships()`, `unlockAchievement(id)` / `unlockAllAchievements()`, `resetAchievements()`.
  - **QA & State Tools:** `inspectState(path)`, `exportSaveJson()`, `importSaveJson()`, `fpsOverlay(bool)` — exposed via both a CLI-style command bar with autocomplete and a touch-friendly `375×812` tabbed quick-action drawer (≥44×44 CSS px targets).

Milestone M2: player travels seamlessly across Holding, River Village, Beach, Forest, Mountains, and Deep Warrens entrance; chops trees, breaks stones, gathers seasonal forage, sees rain water crops and seasons shift palettes, and crafts chests/fences/basic sprinklers; developers can toggle Dev Mode to spawn items, add gold, skip days/seasons, advance storyline/achievements, and inspect state in seconds.

Deliverables:
- `src/js/sim/`: `region.js`, `weather.js`, `forage.js`, `season.js`, `debris.js`, `crafting.js` (Part 1), `milestones.js`, `dev.js`, `achievements.js`
- `src/js/ui/`: `dev-console.js` (mobile-first tabbed drawer + command input)
- Original region tilemaps in `src/assets/maps/` (Holding, River Village, Beach, Forest, Mountains)
- All Phase 2 SPEC tests (`FV-005` included) + season-rollover integration test passing

---

## Phase 3 — Animals & holding buildings (weeks 8–9)

Goal: barn/coop placement, buying and caring for original animals, daily products, affection/quality progression, animal naming, and low-friction mobile care controls.

Features:
- FV-040 Barn & coop buildings → SPEC-FV-040
- FV-041 Purchasing animals → SPEC-FV-041
- FV-042 Animal care (with `{ kind, quality }` product model reconciled in Phase 0) → SPEC-FV-042
- FV-043 Animal happiness → SPEC-FV-043
- FV-044 Animal naming → SPEC-FV-044

UX & Balance Additions:
- **Touch-friendly animal care:** Tap animal to pet/collect in one gesture + shared hay trough autofill, accompanied by synthesized animal chirps/moos and heart particles.
- **Economy ROI check:** Update `economy.json` simulator so barn/coop payback period fits cleanly alongside Phase 2 crops/sprinklers.
- **Dev Console hooks:** Register `spawnAnimal(type, name)` and `maxAnimalHappiness()` in `dev.js`.

Milestone M3: player places a barn/coop on holding plots, buys original animals at Reed's Market, names them, feeds hay/pets smoothly on touch, and collects quality-scaled eggs, wool, and milk.

Deliverables:
- `src/js/sim/`: `animal.js`, `building.js`
- `src/assets/animals.json`
- All Phase 3 SPEC tests passing

---

## Phase 4 — Deep Warrens: mining, combat, loot & blacksmith upgrades (weeks 10–12)

Goal: cohesive dungeon-to-upgrade loop—generated mine floors, ore nodes, 6 original monsters, responsive touch combat, HP/Clinic defeat, loot, geodes, and Blacksmith tool upgrades (including 3×3 hoe/watering can). Week 12 dedicated to mobile combat feel and balance QA.

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

Combat Feel & Mobile Ergonomics Additions:
- **Survival & Juice Mechanics:** Invulnerability frames (i-frames + blink) after contact damage so overlapping monsters don't drain HP per frame; knockback vectors; short hitstop frames; input buffering; and optional **slingshot auto-aim lock-on** for touch controls.
- **Dev Console hooks:** Register `mineFloor(n)`, `clearMineFloor()`, `crackAllGeodes()`, and `setToolTier(tool, tier)` in `dev.js`.

Milestone M4: player enters the Deep Warrens, mines copper/iron/gold, fights 6 original monster types with responsive sword/slingshot touch controls, collects loot/geodes, descends via ladders & 5-floor checkpoints, wakes at the Clinic at 0 HP, cracks geodes, and upgrades tools at the Blacksmith (unlocking 3×3 tilling/watering).

Deliverables:
- `src/js/sim/`: `mine.js`, `monster.js`, `combat.js`, `health.js`, `loot.js`, `geode.js`, `blacksmith.js`
- `src/assets/monsters.json`, `src/assets/loot.json`
- All Phase 4 SPEC tests passing + week 12 mobile combat/hit-flash/knockback/i-frame playtest

---

## Phase 5 — Fishing, advanced crafting, cooking & inventory upgrades (weeks 13–14)

Goal: original touch-calibrated timing fishing minigame, fishing skill/rod progression, full artisan crafting machines, kitchen cooking for energy/HP recovery, and mid-game inventory capacity upgrades.

Features:
- FV-060 Fishing spots → SPEC-FV-060
- FV-061 Fishing minigame (original timing cast-and-reel, shared with FV-110) → SPEC-FV-061
- FV-062 Fishing levels → SPEC-FV-062
- FV-081 Crafting menu (Part 2: full artisan & automation recipes—`Kegs`, `Preserves Jars`, `Quality Sprinklers`) → SPEC-FV-081
- FV-082 Cooking → SPEC-FV-082
- FV-085 expansion: purchasable inventory row/bag upgrades at Reed's Market as a mid-game gold sink.
- Dev Console hooks: register `setSkillLevel('fishing', n)` and `unlockAllRecipes()` in `dev.js`.

Milestone M5: player fishes at river/beach/mountain lake via an original touch-friendly timing minigame, levels fishing for better rods, crafts kegs/preserves jars/quality sprinklers using Deep Warrens ores, unlocks backpack rows, and cooks dishes that restore energy/HP.

Deliverables:
- `src/js/sim/`: `fishing.js`, `fishing-minigame.js`, expanded `crafting.js`, `kitchen.js`
- `src/assets/fish.json`, `src/assets/recipes.json`
- All Phase 5 SPEC tests passing + 375px fishing minigame playtest

---

## Phase 6 — Full villagers, relationships & mail (weeks 15–17)

Goal: elevate River Village from static shopkeepers to 10 scheduled villagers with dynamic context-aware dialogue, gifting/friendship progression, mailbox letters, and Village Restoration milestone rewards.

Features:
- FV-090 Villagers (schedules, homes, workplaces; expands Phase 2 shopkeepers to full 10-villager roster) → SPEC-FV-090
- FV-091 Dialogue (varies by day, season, weather, friendship) → SPEC-FV-091
- FV-092 Friendship (0–10 hearts) → SPEC-FV-092
- FV-093 Gifts (love/like/neutral/dislike reaction tables) → SPEC-FV-093
- FV-102 Mail system (letters, gifts, invitations, Village Restoration updates at holding mailbox) → SPEC-FV-102
- Dev Console hooks: wire `setFriendship`, `maxAllFriendships`, and `sendMail(mailId)` directly to full villager/mail state in `dev.js`.

Milestone M6 (**v1.0 Feature-Complete Candidate**): 10 original villagers follow daily schedules across River Village, respond with dynamic dialogue and gift reactions, build friendship hearts, and send mail/rewards to the holding.

Deliverables:
- `src/js/sim/`: `villager.js`, `schedule.js`, `dialogue.js`, `friendship.js`, `mail.js`
- `src/assets/villagers.json`
- All Phase 6 SPEC tests passing

---

## Phase 7 — Original music score, polish & v1.0 release QA (weeks 18–19)

Goal: layer full original region/season music on top of existing SFX/particles, polish lighting/weather atmosphere, run cross-phase save-migration & endurance integration tests, and certify mobile hardware performance for **River Village v1.0**.

Features:
- FV-130 Music (100% original Web Audio / CC0 tracks per region/season/menu—zero `music.xwb` dependency) → SPEC-FV-130
- FV-131 Sound effects (final spatial mix & volume balance across all systems) → SPEC-FV-131
- FV-132 Particle effects (weather rain/snow/fireflies, spell & polish pass) → SPEC-FV-132
- Release QA across FV-001..FV-004 (offline installability on iOS/Android, cache ≤ 30 MB, `375×812` & `812×375` layout, `<50` draw calls, `schemaVersion` save migration verification)

Milestone M7 (**River Village v1.0 Ship Gate**): complete core farm-life loop (farming, FTUE, seasons, basic/artisan crafting, animals, Deep Warrens, fishing, cooking, 10 villagers, mail, full original audio/particles), playable offline on mobile PWA and desktop at smooth 60fps.

Deliverables:
- Final `src/js/render/audio.js`, `src/js/render/particles.js`
- Original OGG/MP3 or Web Audio score modules in `src/assets/audio/` + complete `src/assets/ATTRIBUTION.md`
- Cross-phase integration & `schemaVersion` save-migration suite passing
- Precache audit (≤ 30 MB), IP-lint audit, and mobile hardware QA sign-off

---

## Phase 8 — Expansion / v1.1 content: marriage, festivals & arcade (weeks 20–24)

*Note: Ships as v1.1 post-launch or merges into v1.0 if Phases 0–7 finish ahead of schedule.*

### Sub-phase 8A — Marriage & heart/birthday events (weeks 20–21)
- FV-094 Marriage (10-heart proposal with original pendant, spouse moves to holding) → SPEC-FV-094
- FV-101 Villager events (heart events & birthdays) → SPEC-FV-101
- Deliverables: `src/js/sim/marriage.js`, `src/js/sim/events.js`

### Sub-phase 8B — Season festivals & saloon arcade (weeks 22–24)
- FV-100 Season festivals (Spring Egg Hunt, Summer Luau, Fall Fair, Winter Feast) → SPEC-FV-100
- FV-110 Fishing minigame (festival contest integration) → SPEC-FV-110
- FV-111 Festival games → SPEC-FV-111
- FV-112 Arcade at the saloon → SPEC-FV-112
- Deliverables: `src/js/sim/festival.js`, `src/js/sim/festival-games.js`, `src/js/sim/arcade.js`, `src/assets/festivals.json`

Milestone M8 (**Full 58-Feature Completion**): marriage, birthdays/heart events, 4 seasonal festivals, and the saloon arcade cabinet playable and verified end-to-end (including Dev Console hooks for `triggerEvent`, `startFestival`, `setSpouse`, and `addArcadeTokens`).

---

## Release checklist — Full River Village

- All **58** `SPEC` tests (`FV-001` through `FV-132`, including `FV-005`) pass in `src/tests/<feature-id>.test.js`
- Cross-phase integration, save-migration, and 1-year economy simulation checks pass
- Mobile-first verified on `375×812` portrait and `812×375` landscape touch viewports (≥44×44 CSS px targets, no hover-only interactions, iOS A2HS fallback, `visibilitychange` auto-pause)
- PWA installs and runs 100% offline within precache budget (≤ 30 MB) and `<50` draw calls per scene
- 100% original IP & names (automated check against `src/assets/names.json`), zero `.xnb`/`.xwb`/`.xsb` formats or copyrighted reference assets in `src/`
