# features.md — River Village feature catalogue

Each feature below has a stable id (FV-###) used by SPEC.md (one test per feature) and PLAN.md (phases).
All names are original River Village IP — no reference-game names are used.

## Platform & shell

| Id | Feature | Description |
|---|---|---|
| FV-001 | PWA shell | index.html + manifest.webmanifest + service worker; installable, offline-capable, cached shell and assets. |
| FV-002 | Responsive mobile-first UI | Every screen usable at 375px width; touch targets ≥44×44 CSS px; no hover-only interactions. |
| FV-003 | Settings panel | Audio volume toggle, music toggle, screen shake toggle, language (original strings), credits. |
| FV-004 | Save / load | LocalStorage-backed save slots (3), autosave on day-end and sleep, delete-save confirmation. |
| FV-005 | Dev console & mode | Gated developer mode and mobile-friendly console/drawer to add gold/items, refill energy/HP, advance time/weather/seasons, boost villager friendship, advance storyline/milestones, and unlock achievements. |

## Character & holding

| Id | Feature | Description |
|---|---|---|
| FV-010 | Character creation | Choose appearance (hair, skin, shirt), name the player character and the holding; enter River Village on day 1 of Spring (Year 1). |
| FV-011 | Player bedroom | Wake/sleep flow; sleeping ends the day and advances to the next morning. |
| FV-012 | Holding map | The player's starting farm plot with tillable soil, a few trees, and space for buildings. |

## World & movement

| Id | Feature | Description |
|---|---|---|
| FV-020 | Tile-based movement | Grid-based 8-direction movement on an isometric three.js map; touch D-pad + desktop WASD/arrows. |
| FV-021 | Region travel | Travel between River Village, the beach, the forest, the mountains, and the Deep Warrens mine entrance via map edges / warps. |
| FV-022 | Day/night cycle | Clock from 6:00 to 02:00; sun/moon lighting; shops open/close by time; villagers follow schedules. |
| FV-023 | Seasons & weather | Spring/Summer/Fall/Winter; weather (sunny/rainy/stormy) affects crops, watering, and villager schedules. |

## Farming

| Id | Feature | Description |
|---|---|---|
| FV-030 | Tilling soil | Use the hoe on dirt patches to create tilled tiles. |
| FV-031 | Planting crops | Plant original crop seeds (e.g., spring root, summer berry, fall grain) in tilled tiles from an inventory toolbar. |
| FV-032 | Watering | Water tiles with the watering can; unwatered crops do not grow; rain waters automatically. |
| FV-033 | Crop growth stages | Crops progress through seed → sprout → young → mature over season-specific days; harvestable when mature. |
| FV-034 | Harvesting | Collect mature crops into inventory; regrow crops (e.g., berries) produce multiple harvests. |
| FV-035 | Crop tool upgrades | Better hoe/watering can that till/water a 3×3 area (unlocked via upgrades, FV-080). |

## Animals

| Id | Feature | Description |
|---|---|---|
| FV-040 | Barn & coop buildings | Place a barn (large animals) and coop (small animals) on the holding. |
| FV-041 | Purchasing animals | Buy original farm animals (e.g., river hens, woolly sheep, meadow cows) at Reed's Market. |
| FV-042 | Animal care | Feed hay daily, pet animals, collect products (eggs, wool, milk). |
| FV-043 | Animal happiness | Affection rises with care; happy animals produce better-quality products. |
| FV-044 | Animal naming | Name each animal; names stored per save. |

## Mining & combat (Deep Warrens)

| Id | Feature | Description |
|---|---|---|
| FV-050 | Mine entrance | Enter the Deep Warrens from the mountains; each floor is a generated dungeon level. |
| FV-051 | Mining nodes | Break ore nodes (copper, iron, gold) with a pickaxe to gather ore. |
| FV-052 | Monsters | Original creatures (puddles, bats, dust spirits, cave crabs) patrol floors; contact deals damage. |
| FV-053 | Combat | Swing a sword or use a slingshot; monsters have HP and drop loot. |
| FV-054 | Mine floors & ladders | Descend via ladders; floors regenerate on re-entry; checkpoints every 5 floors. |
| FV-055 | Health & energy | Player HP and energy bars; energy spent on tools, restored by food/sleep; HP 0 → wake at the clinic. |

## Fishing

| Id | Feature | Description |
|---|---|---|
| FV-060 | Fishing spots | Fish at the river, beach, and mountain lake using a fishing rod. |
| FV-061 | Fishing minigame | Timing-based cast-and-reel (original, not copied); catch original fish (river dace, pond gill, ocean ray). |
| FV-062 | Fishing levels | Skill rises with catches; better rods unlock new spots and fish. |

## Foraging & world interaction

| Id | Feature | Description |
|---|---|---|
| FV-070 | Forageables | Pick up original wild items (spring onions, summer grapes, fall nuts, winter roots) from the ground. |
| FV-071 | Trees & debris | Chop trees for wood, break stones for stone, clear weeds for fiber. |
| FV-072 | Resource regeneration | Debris and forageables respawn on season change. |

## Crafting, cooking & economy

| Id | Feature | Description |
|---|---|---|
| FV-080 | Tool upgrades | Upgrade hoe/watering can/pickaxe/axe at the blacksmith using ore + gold. |
| FV-081 | Crafting menu | Craft original items (fences, kegs, preserves jars, chests, sprinklers) from recipes unlocked by leveling. |
| FV-082 | Cooking | Cook original recipes at the holding's kitchen using foraged/cropped ingredients; food restores energy/HP. |
| FV-083 | Shipping bin | Sell crops, animal products, forage, and ore for gold at day-end. |
| FV-084 | Reed's Market | Shop NPC selling seeds, tools, and basic supplies; prices vary by season. |
| FV-085 | Inventory | Grid inventory with tool belt, stackable items, and a chest at the holding for storage. |

## Villagers & relationships

| Id | Feature | Description |
|---|---|---|
| FV-090 | Villagers | 10 original villagers in River Village, each with a schedule, home, and workplace. |
| FV-091 | Dialogue | Talk to villagers; dialogue changes by day, season, weather, and friendship level. |
| FV-092 | Friendship | Gifting liked items raises friendship; hearts (0–10) per villager; events at heart milestones. |
| FV-093 | Gifts | Each villager loves/likes/neutral/dislikes specific original items. |
| FV-094 | Marriage | After high friendship and an original pendant, marry an eligible villager who moves to the holding. |

## Festivals & events

| Id | Feature | Description |
|---|---|---|
| FV-100 | Season festivals | 4 original festivals (Spring Egg Hunt, Summer Luau, Fall Fair, Winter Feast) with minigames and rewards. |
| FV-101 | Villager events | Heart events and birthday events triggered by schedule and date. |
| FV-102 | Mail system | Receive original letters from villagers and Brightgate Co. at the holding mailbox. |

## Minigames

| Id | Feature | Description |
|---|---|---|
| FV-110 | Fishing minigame | See FV-061 (shared implementation). |
| FV-111 | Festival games | Original festival contests (e.g., egg hunt collection, grange display judging). |
| FV-112 | Arcade at the saloon | Play an original original arcade cabinet (e.g., "Jujo-Ball" renamed) for tokens. |

## Monsters & loot

| Id | Feature | Description |
|---|---|---|
| FV-120 | Monster roster | Puddle, Glop, Bat, Dust Spirit, Cave Crab, Serpent (original names). |
| FV-121 | Loot drops | Monsters drop original items (slime, bat wing, coal, geodes). |
| FV-122 | Geodes | Crack geodes at the blacksmith for minerals and artifacts. |

## Audio & visuals

| Id | Feature | Description |
|---|---|---|
| FV-130 | Music | Original ambient tracks per region/season; menu and festival themes. |
| FV-131 | Sound effects | Original SFX for tools, footsteps, UI, animals, fishing, combat. |
| FV-132 | Particle effects | Original particle system for watering, harvesting, fishing splashes, spell effects. |
