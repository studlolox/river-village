# PLAN.md — River Village phased build plan

Build order follows dependency: shell → core loop (movement, time, farm) → content (animals, mine, fish, crafting, villagers, festivals) → polish (audio, particles, save). Each phase ends when every SPEC test for its features passes.

## Phase 0 — Foundation (weeks 1–2)

Goal: a runnable PWA shell with an isometric three.js world, movement, time, and save.

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

Milestone M0: player can start a new game, name character+holding, walk around the holding, sleep to advance days, and the game installs/works offline. Original art placeholders only.

Deliverables:
- `src/index.html`, `manifest.webmanifest`, `sw.js`
- `src/js/world.js`, `src/js/player.js`, `src/js/time.js`, `src/js/save.js`, `src/js/settings.js`
- `src/tests/*.test.js` for all Phase 0 features, all passing

---

## Phase 1 — Farming core (weeks 3–4)

Goal: the core farming loop — till, plant, water, grow, harvest, ship.

Features:
- FV-030 Tilling soil → SPEC-FV-030
- FV-031 Planting crops → SPEC-FV-031
- FV-032 Watering → SPEC-FV-032
- FV-033 Crop growth stages → SPEC-FV-033
- FV-034 Harvesting → SPEC-FV-034
- FV-083 Shipping bin → SPEC-FV-083
- FV-084 Reed's Market → SPEC-FV-084
- FV-085 Inventory → SPEC-FV-085

Milestone M1: player can till soil, plant crops, water them, watch them grow over days, harvest, and ship for gold at Reed's Market.

Deliverables:
- `src/js/farm.js`, `src/js/crop.js`, `src/js/inventory.js`, `src/js/shop.js`, `src/js/shipping.js`
- Crop data (original crop definitions) in `src/assets/crops.json`
- All Phase 1 SPEC tests passing

---

## Phase 2 — World & regions (weeks 5–6)

Goal: travel beyond the holding, seasons/weather, foraging, and trees/debris.

Features:
- FV-021 Region travel → SPEC-FV-021
- FV-023 Seasons & weather → SPEC-FV-023
- FV-070 Forageables → SPEC-FV-070
- FV-071 Trees & debris → SPEC-FV-071
- FV-072 Resource regeneration → SPEC-FV-072

Milestone M2: player can travel to beach/forest/mountains, forage, chop trees, break stones, and see seasons/weather change gameplay.

Deliverables:
- `src/js/region.js`, `src/js/weather.js`, `src/js/forage.js`, `src/js/season.js`
- Region maps (original) as tile data; no reference-map copies

---

## Phase 3 — Animals (weeks 7–8)

Goal: barn/coop, buying and caring for animals, products, happiness, naming.

Features:
- FV-040 Barn & coop buildings → SPEC-FV-040
- FV-041 Purchasing animals → SPEC-FV-041
- FV-042 Animal care → SPEC-FV-042
- FV-043 Animal happiness → SPEC-FV-043
- FV-044 Animal naming → SPEC-FV-044

Milestone M3: player can place a barn/coop, buy original animals at Reed's Market, feed/pet them, and collect products.

Deliverables:
- `src/js/animal.js`, `src/js/building.js`
- Original animal definitions in `src/assets/animals.json`

---

## Phase 4 — Mining & combat (weeks 9–10)

Goal: the Deep Warrens mine, ores, monsters, combat, health/energy.

Features:
- FV-050 Mine entrance → SPEC-FV-050
- FV-051 Mining nodes → SPEC-FV-051
- FV-052 Monsters → SPEC-FV-052
- FV-053 Combat → SPEC-FV-053
- FV-054 Mine floors & ladders → SPEC-FV-054
- FV-055 Health & energy → SPEC-FV-055
- FV-035 Crop tool upgrades → SPEC-FV-035 (tool upgrade plumbing)

Milestone M4: player can enter the mine, mine ore, fight original monsters with a sword, use ladders/checkpoints, and manage HP/energy.

Deliverables:
- `src/js/mine.js`, `src/js/monster.js`, `src/js/combat.js`, `src/js/health.js`
- Original monster definitions in `src/assets/monsters.json`

---

## Phase 5 — Fishing (weeks 11–12)

Goal: fishing spots, original fishing minigame, skill levels, rods.

Features:
- FV-060 Fishing spots → SPEC-FV-060
- FV-061 Fishing minigame → SPEC-FV-061
- FV-062 Fishing levels → SPEC-FV-062

Milestone M5: player can fish at river/beach/lake through an original timing minigame and raise fishing level.

Deliverables:
- `src/js/fishing.js`, `src/js/fishing-minigame.js`
- Original fish definitions in `src/assets/fish.json`

---

## Phase 6 — Crafting, cooking & tools (weeks 13–14)

Goal: crafting recipes, cooking, tool upgrades at blacksmith.

Features:
- FV-080 Tool upgrades → SPEC-FV-080
- FV-081 Crafting menu → SPEC-FV-081
- FV-082 Cooking → SPEC-FV-082

Milestone M6: player can craft fences/kegs/chests, cook dishes that restore energy/HP, and upgrade tools at the blacksmith.

Deliverables:
- `src/js/crafting.js`, `src/js/kitchen.js`, `src/js/blacksmith.js`
- Recipes in `src/assets/recipes.json`

---

## Phase 7 — Villagers & relationships (weeks 15–16)

Goal: 10 original villagers, schedules, dialogue, friendship, gifts, marriage.

Features:
- FV-090 Villagers → SPEC-FV-090
- FV-091 Dialogue → SPEC-FV-091
- FV-092 Friendship → SPEC-FV-092
- FV-093 Gifts → SPEC-FV-093
- FV-094 Marriage → SPEC-FV-094

Milestone M7: villagers walk schedules, dialogue changes by friendship/season, gifting raises hearts, and marriage at 10 hearts moves a spouse to the holding.

Deliverables:
- `src/js/villager.js`, `src/js/schedule.js`, `src/js/dialogue.js`, `src/js/friendship.js`, `src/js/marriage.js`
- Original villager definitions in `src/assets/villagers.json`

---

## Phase 8 — Festivals & events (weeks 17–18)

Goal: 4 season festivals, villager/birthday events, mail.

Features:
- FV-100 Season festivals → SPEC-FV-100
- FV-101 Villager events → SPEC-FV-101
- FV-102 Mail system → SPEC-FV-102

Milestone M8: festival days switch the village to festival mode with minigames and rewards; birthdays and heart events fire; mail arrives.

Deliverables:
- `src/js/festival.js`, `src/js/events.js`, `src/js/mail.js`
- Festival calendar in `src/assets/festivals.json`

---

## Phase 9 — Minigames & arcade (weeks 19–20)

Goal: festival contests, saloon arcade.

Features:
- FV-110 Fishing minigame (shared with FV-061) → SPEC-FV-110
- FV-111 Festival games → SPEC-FV-111
- FV-112 Arcade at the saloon → SPEC-FV-112

Milestone M9: the saloon arcade and festival contests are playable for tokens/prizes.

Deliverables:
- `src/js/arcade.js`, `src/js/festival-games.js`

---

## Phase 10 — Monsters loot & geodes (weeks 21–22)

Goal: monster loot table, geode cracking.

Features:
- FV-120 Monster roster → SPEC-FV-120
- FV-121 Loot drops → SPEC-FV-121
- FV-122 Geodes → SPEC-FV-122

Milestone M10: monsters drop original loot; geodes crack at the blacksmith into minerals/artifacts.

Deliverables:
- `src/js/loot.js`, `src/js/geode.js`

---

## Phase 11 — Audio, particles & polish (weeks 23–24)

Goal: original music, SFX, particles, PWA final QA.

Features:
- FV-130 Music → SPEC-FV-130
- FV-131 Sound effects → SPEC-FV-131
- FV-132 Particle effects → SPEC-FV-132
- All remaining FV-001..FV-004 shell polish

Milestone M11: full audio (original), particles for farming/fishing/combat, PWA installable + offline, all SPEC tests passing.

Deliverables:
- `src/js/audio.js`, `src/js/particles.js`
- Original audio in `src/assets/audio/` (OGG/MP3); original music per region/season

---

## Release — River Village v1.0

- All 33 SPEC tests pass
- Mobile-first verified on 375px+ viewports
- PWA installs and runs offline
- Original names only (checked against `src/assets/names.json`)
- No reference-game assets in `src/assets/`

## Naming reminder

Every character, place, creature, crop, item, and festival introduced in any phase must use an original River Village name registered in `src/assets/names.json`. No reference-game names anywhere in code, dialogue, UI, or assets.
