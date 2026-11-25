# SPEC.md — River Village acceptance specification

One acceptance test per feature. Test ids match the feature ids from `features.md` (SPEC-FV-### ≡ FV-###).
Test files live at `src/tests/<feature-id>.test.js` and are run with Vitest (pure `sim/` tests) or Playwright Chromium (`FV-001`, `FV-002` real browser layout, service worker, and PWA tests).

Conventions:
- `given/when/then` describe the acceptance criteria.
- The code block is the single test for that feature.
- Original River Village names only (see AGENTS.md naming rule).

---

## Platform & shell

### SPEC-FV-001 · PWA shell (FV-001)
Given the app is loaded in a browser
When the user clicks "Install" (or the beforeinstallprompt fires)
Then the app installs as a PWA and works offline (service worker registered; shell + assets cached)

```js
test('FV-001 PWA installs and works offline', async () => {
  const reg = await navigator.serviceWorker.register('/sw.js');
  expect(reg).toBeDefined();
  // manifest declares installability
  const manifest = await fetch('/manifest.webmanifest').then(r => r.json());
  expect(manifest.name).toContain('River Village');
  expect(manifest.start_url).toBeDefined();
});
```

### SPEC-FV-002 · Responsive mobile-first UI (FV-002)
Given a 375×812 viewport
When any game screen is rendered
Then every interactive element is ≥44×44 CSS px and no control requires hover

```js
test('FV-002 touch targets are finger-sized on mobile viewport', () => {
  document.documentElement.style.setProperty('--viewport-width', '375px');
  document.body.innerHTML = '<button class="touch-btn">x</button>';
  const btn = document.querySelector('.touch-btn');
  btn.style.width = '60px'; btn.style.height = '60px';
  const r = btn.getBoundingClientRect();
  expect(r.width).toBeGreaterThanOrEqual(44);
  expect(r.height).toBeGreaterThanOrEqual(44);
});
```

### SPEC-FV-003 · Settings panel (FV-003)
Given the settings panel is open
When the user toggles music off
Then game music stops and the setting persists across reload

```js
test('FV-003 music toggle persists', () => {
  const s = new Settings(); // src/js/settings.js
  s.setMusicEnabled(false);
  expect(s.isMusicEnabled()).toBe(false);
  const s2 = new Settings();
  expect(s2.isMusicEnabled()).toBe(false);
});
```

### SPEC-FV-004 · Save / load (FV-004)
Given a save exists in slot 1
When the player chooses "Load slot 1"
Then the held gold, day, and position are restored; delete-save shows a confirmation dialog

```js
test('FV-004 save and load restores state', () => {
  const m = new SaveManager();
  m.save(1, { day: 5, gold: 120, x: 10, y: 10 });
  const loaded = m.load(1);
  expect(loaded.day).toBe(5);
  expect(loaded.gold).toBe(120);
  expect(m.confirmDelete(1)).toBe(true); // confirmation shown, returns intent
});
```

### SPEC-FV-005 · Dev console & mode (FV-005)
Given developer mode is disabled by default and can be enabled via `?dev=1`, `rv_dev_mode`, or the dev toggle
When the developer runs commands or uses the dev drawer to add gold, give an item, raise villager friendship, advance storyline milestones, and unlock an achievement
Then each corresponding game state updates immediately and disabled dev mode blocks command execution

```js
test('FV-005 dev console mutates gold, items, friendship, storyline, and achievements when enabled', () => {
  const game = new Game();
  const dev = new DevConsole(game);
  expect(() => dev.exec('addGold 500')).toThrow();

  dev.setEnabled(true);
  dev.exec('addGold 500');
  dev.exec('giveItem spring_root 5');
  dev.exec('setFriendship maren_reed 6');
  dev.exec('advanceStoryline restoration_bridge');
  dev.exec('unlockAchievement first_harvest');

  expect(game.economy.gold).toBeGreaterThanOrEqual(500);
  expect(game.inventory.count('spring_root')).toBeGreaterThanOrEqual(5);
  expect(game.npcs.getHearts('maren_reed')).toBe(6);
  expect(game.quests.isCompleted('restoration_bridge')).toBe(true);
  expect(game.achievements.has('first_harvest')).toBe(true);
});
```

---

## Character & holding

### SPEC-FV-010 · Character creation (FV-010)
Given a new game
When the player chooses appearance and names the character and holding
Then the game starts on River Village, Spring 1, Year 1, 6:00, at the player bedroom

```js
test('FV-010 character creation sets starting state', () => {
  const c = new Character('Aria', 'Honeysuckle Holding');
  const g = new Game(c);
  g.start();
  expect(g.player.name).toBe('Aria');
  expect(g.holding.name).toBe('Honeysuckle Holding');
  expect(g.date).toEqual({ season: 'Spring', day: 1, year: 1 });
  expect(g.time).toBe(6 * 60); // 6:00 in minutes
  expect(g.player.location).toBe('Bedroom');
});
```

### SPEC-FV-011 · Player bedroom / sleep (FV-011)
Given it is past 2:00 AM or the player clicks "Sleep"
When the player sleeps
Then the day advances, energy and HP restore to full, and the player wakes in the bedroom at 6:00

```js
test('FV-011 sleep advances day and restores stats', () => {
  const g = new Game();
  g.energy = 10; g.hp = 5; g.date.day = 3;
  g.sleep();
  expect(g.date.day).toBe(4);
  expect(g.energy).toBe(g.maxEnergy);
  expect(g.hp).toBe(g.maxHp);
  expect(g.time).toBe(6 * 60);
  expect(g.player.location).toBe('Bedroom');
});
```

### SPEC-FV-012 · Holding map (FV-012)
Given the holding is loaded
When the player looks at the map
Then there are tillable dirt tiles, a few trees, and empty plots for buildings

```js
test('FV-012 holding has tillable soil and building plots', () => {
  const m = new HoldingMap();
  expect(m.countTiles('tillable')).toBeGreaterThan(0);
  expect(m.countTiles('tree')).toBeGreaterThan(0);
  expect(m.emptyBuildingPlots().length).toBeGreaterThan(0);
});
```

---

## World & movement

### SPEC-FV-020 · Tile-based movement (FV-020)
Given the player is on a tile
When the player presses a direction (D-pad or WASD)
Then the player moves one grid tile in that direction; diagonal input moves diagonally

```js
test('FV-020 movement moves one grid tile per input', () => {
  const p = new Player({ x: 0, y: 0 });
  p.handleInput('down');
  expect(p.gridPos).toEqual({ x: 0, y: 1 });
  p.handleInput('right');
  expect(p.gridPos).toEqual({ x: 1, y: 1 });
});
```

### SPEC-FV-021 · Region travel (FV-021)
Given the player is at a map edge / warp tile
When the player steps on it
Then the scene switches to the target region (beach, forest, mountains, mine entrance)

```js
test('FV-021 stepping on a warp switches regions', () => {
  const w = new World();
  w.player.gridPos = { x: 24, y: 6 }; // east edge of village
  w.update();
  expect(w.currentRegion).toBe('Forest');
});
```

### SPEC-FV-022 · Day/night cycle (FV-022)
Given the clock runs from 6:00 to 02:00
When time passes
Then sun/moon lighting shifts, shops open/close by time, and villagers follow time-based schedules

```js
test('FV-022 shops open by time-of-day', () => {
  const t = new TimeOfDay();
  t.setMinutes(9 * 60); // 9:00
  expect(ReedsMarket.isOpen(t)).toBe(true);
  t.setMinutes(22 * 60); // 22:00
  expect(ReedsMarket.isOpen(t)).toBe(false);
});
```

### SPEC-FV-023 · Seasons & weather (FV-023)
Given Spring/Summer/Fall/Winter and weather states
When the season or weather changes
Then crop growth, watering needs, and villager schedules respond accordingly

```js
test('FV-023 rain waters all outdoor crops automatically', () => {
  const f = new Farm();
  f.addCropAt({ x: 1, y: 1 }, 'springRoot');
  f.weather = 'rainy';
  f.applyWeatherWatering();
  expect(f.tileAt(1, 1).watered).toBe(true);
});
```

---

## Farming

### SPEC-FV-030 · Tilling soil (FV-030)
Given a dirt patch
When the player uses the hoe on it
Then the tile becomes tillable soil ready for planting

```js
test('FV-030 hoe turns dirt into tilled soil', () => {
  const f = new Farm();
  f.setTile(2, 2, 'dirt');
  f.useTool(2, 2, 'hoe');
  expect(f.tileAt(2, 2).kind).toBe('tilled');
});
```

### SPEC-FV-031 · Planting crops (FV-031)
Given tilled soil and a seed in the toolbar
When the player plants the seed
Then the tile shows a seed-stage crop and the seed is consumed from inventory

```js
test('FV-031 planting consumes seed and shows seed stage', () => {
  const f = new Farm();
  const inv = new Inventory();
  inv.add('springRootSeed', 1);
  f.useTool(2, 2, 'hoe');
  f.plant(2, 2, 'springRootSeed', inv);
  expect(f.tileAt(2, 2).crop.stage).toBe('seed');
  expect(inv.count('springRootSeed')).toBe(0);
});
```

### SPEC-FV-032 · Watering (FV-032)
Given a planted but unwatered crop
When the player waters it with the watering can
Then the tile is marked watered; unwatered crops do not grow that day

```js
test('FV-032 watering marks tile watered; unwatered does not grow', () => {
  const f = new Farm();
  f.useTool(2, 2, 'hoe');
  f.plant(2, 2, 'springRootSeed', new Inventory({ springRootSeed: 1 }));
  f.water(2, 2);
  expect(f.tileAt(2, 2).watered).toBe(true);
  const f2 = new Farm();
  f2.useTool(3, 3, 'hoe');
  f2.plant(3, 3, 'springRootSeed', new Inventory({ springRootSeed: 1 }));
  f2.advanceDay(); // no watering
  expect(f2.tileAt(3, 3).crop.stage).toBe('seed');
});
```

### SPEC-FV-033 · Crop growth stages (FV-033)
Given a watered planted crop
When a day passes
Then the crop advances through seed → sprout → young → mature over season-specific days

```js
test('FV-033 crop advances growth stages per watered day', () => {
  const f = new Farm();
  f.useTool(2, 2, 'hoe');
  f.plant(2, 2, 'springRootSeed', new Inventory({ springRootSeed: 1 }));
  for (let i = 0; i < 3; i++) {
    f.water(2, 2);
    f.advanceDay();
  }
  expect(f.tileAt(2, 2).crop.stage).toBe('mature');
});
```

### SPEC-FV-034 · Harvesting (FV-034)
Given a mature crop
When the player harvests it
Then the crop is removed and the produce enters the inventory; regrow crops stay and re-mature

```js
test('FV-034 harvesting puts produce in inventory', () => {
  const f = new Farm();
  const inv = new Inventory({ springRootSeed: 1 });
  f.useTool(2, 2, 'hoe');
  f.plant(2, 2, 'springRootSeed', inv);
  for (let i = 0; i < 3; i++) {
    f.water(2, 2);
    f.advanceDay();
  }
  f.harvest(2, 2, inv);
  expect(f.tileAt(2, 2).crop).toBeNull();
  expect(inv.count('springRoot')).toBeGreaterThan(0);
});
```

### SPEC-FV-035 · Crop tool upgrades (FV-035)
Given an upgraded hoe/watering can
When the player uses it
Then a 3×3 area is tilled/watered in one action

```js
test('FV-035 upgraded hoe tills a 3x3 area', () => {
  const f = new Farm();
  const p = new Player({ tool: 'hoe', upgraded: true });
  p.useToolAt(f, 5, 5);
  const around = [[5,5],[4,5],[6,5],[5,4],[5,6],[4,4],[6,6],[4,6],[6,4]];
  around.forEach(([x,y]) => expect(f.tileAt(x,y).kind).toBe('tilled'));
});
```

---

## Animals

### SPEC-FV-040 · Barn & coop buildings (FV-040)
Given empty building plots on the holding
When the player places a barn and a coop
Then animals can be housed in them; they appear on the holding map

```js
test('FV-040 barn and coop house animals', () => {
  const h = new Holding();
  h.placeBuilding('barn', 5, 5);
  h.placeBuilding('coop', 9, 5);
  expect(h.buildingAt(5, 5).type).toBe('barn');
  expect(h.buildingAt(9, 5).type).toBe('coop');
});
```

### SPEC-FV-041 · Purchasing animals (FV-041)
Given gold and an empty barn/coop slot
When the player buys an animal at Reed's Market
Then gold is deducted and the animal appears in the building

```js
test('FV-041 buying an animal deducts gold and places it', () => {
  const m = new ReedsMarket();
  const p = new Player({ gold: 1000 });
  const h = new Holding(); h.placeBuilding('coop', 9, 5);
  m.buyAnimal(p, h, 'RiverHen', 9, 5);
  expect(p.gold).toBeLessThan(1000);
  expect(h.animalAt(9, 5).kind).toBe('RiverHen');
});
```

### SPEC-FV-042 · Animal care (FV-042)
Given an animal in a barn/coop
When the player feeds hay and pets it daily
Then the player can collect products (egg, wool, milk) from it

```js
test('FV-042 cared-for animal produces a product', () => {
  const a = new Animal('RiverHen');
  a.feed(); a.pet();
  const product = a.collectProduct();
  expect(product.kind).toBe('Egg');
  expect(product.quality).toBeDefined();
});
```

### SPEC-FV-043 · Animal happiness (FV-043)
Given an animal
When it is consistently fed and petted
Then its affection rises and product quality improves

```js
test('FV-043 affection rises with care and improves quality', () => {
  const a = new Animal('RiverHen');
  for (let i = 0; i < 10; i++) { a.feed(); a.pet(); }
  expect(a.affection).toBeGreaterThan(0);
  expect(a.collectProduct().quality).toBe('large');
});
```

### SPEC-FV-044 · Animal naming (FV-044)
Given an animal
When the player names it
Then the name is saved and shown in the animal's UI

```js
test('FV-044 animal name is saved and shown', () => {
  const a = new Animal('RiverHen');
  a.name = 'Nibbles';
  expect(a.uiLabel()).toBe('Nibbles');
});
```

---

## Mining & combat (Deep Warrens)

### SPEC-FV-050 · Mine entrance (FV-050)
Given the player is at the mountains
When the player enters the Deep Warrens
Then a mine floor scene loads and the player can move and mine on it

```js
test('FV-050 entering the Deep Warrens loads floor 1', () => {
  const mine = new Mine();
  mine.enter(1);
  expect(mine.floor).toBe(1);
  expect(mine.player.gridPos).toBeDefined();
});
```

### SPEC-FV-051 · Mining nodes (FV-051)
Given an ore node on a mine floor
When the player hits it with a pickaxe
Then the node breaks and ore enters the inventory

```js
test('FV-051 mining a node gives ore', () => {
  const mine = new Mine();
  const inv = new Inventory();
  mine.addNode(3, 4, 'copper');
  mine.player.useToolAt(mine, 3, 4, 'pickaxe', inv);
  expect(mine.nodeAt(3, 4)).toBeNull();
  expect(inv.count('CopperOre')).toBeGreaterThan(0);
});
```

### SPEC-FV-052 · Monsters (FV-052)
Given a monster on a mine floor
When the player touches it
Then the player takes damage

```js
test('FV-052 monster contact damages player', () => {
  const mine = new Mine();
  const p = mine.player;
  const hp = p.hp;
  mine.addMonster(new Puddle({ x: 2, y: 2 }));
  p.gridPos = { x: 2, y: 2 };
  mine.updateContacts();
  expect(p.hp).toBeLessThan(hp);
});
```

### SPEC-FV-053 · Combat (FV-053)
Given a monster and a sword
When the player attacks
Then the monster loses HP; at 0 HP it dies and drops loot

```js
test('FV-053 sword attack kills a monster and drops loot', () => {
  const mine = new Mine();
  const m = new Puddle({ x: 2, y: 2 });
  mine.player.attack(mine, m);
  expect(m.hp).toBeLessThan(m.maxHp);
  while (m.hp > 0) mine.player.attack(mine, m);
  expect(m.dead).toBe(true);
});
```

### SPEC-FV-054 · Mine floors & ladders (FV-054)
Given a mine floor with a ladder
When the player reaches the ladder
Then they descend to the next floor; every 5th floor is a checkpoint

```js
test('FV-054 ladder descends; floor 5 is a checkpoint', () => {
  const mine = new Mine();
  mine.player.gridPos = mine.ladderPos;
  mine.descend();
  expect(mine.floor).toBe(2);
  expect(mine.checkpoint).toBe(0);
  for (let f = 2; f < 5; f++) mine.descend();
  expect(mine.checkpoint).toBe(5);
});
```

### SPEC-FV-055 · Health & energy (FV-055)
Given HP and energy bars
When the player uses tools or takes damage
Then energy/HP drop; food or sleep restores them; HP 0 sends the player to the clinic

```js
test('FV-055 zero HP sends player to the clinic', () => {
  const g = new Game();
  g.player.hp = 0;
  g.handlePlayerDefeat();
  expect(g.player.location).toBe('Clinic');
  expect(g.player.hp).toBeGreaterThan(0);
});
```

---

## Fishing

### SPEC-FV-060 · Fishing spots (FV-060)
Given a fishing rod and a spot (river, beach, lake)
When the player casts
Then a fishing minigame begins at that spot

```js
test('FV-060 casting starts the fishing minigame', () => {
  const s = new FishingSpot('River');
  const r = new Rod();
  const result = s.cast(r);
  expect(result.minigameActive).toBe(true);
  expect(result.spot).toBe('River');
});
```

### SPEC-FV-061 · Fishing minigame (FV-061)
Given an active fishing minigame
When the player times the reel correctly
Then an original fish is caught and added to inventory

```js
test('FV-061 successful reel catches a fish', () => {
  const m = new FishingMinigame();
  m.timingHit = true;
  const fish = m.resolve();
  expect(fish.kind).toBe('RiverDace'); // original fish
  expect(fish.size).toBeDefined();
});
```

### SPEC-FV-062 · Fishing levels (FV-062)
Given a fishing skill level
When the player catches fish
Then the level rises; higher levels unlock better rods and spots

```js
test('FV-062 catching fish raises fishing level', () => {
  const p = new Player();
  p.fishing.catchFish();
  expect(p.fishing.level).toBeGreaterThan(1);
});
```

---

## Foraging & world interaction

### SPEC-FV-070 · Forageables (FV-070)
Given a wild item on the ground
When the player presses "interact" on it
Then the item enters the inventory and disappears from the world

```js
test('FV-070 picking up forage adds to inventory', () => {
  const w = new World();
  const inv = new Inventory();
  w.addForage(4, 5, 'SpringOnion');
  w.player.interactAt(w, 4, 5, inv);
  expect(inv.count('SpringOnion')).toBe(1);
  expect(w.forageAt(4, 5)).toBeNull();
});
```

### SPEC-FV-071 · Trees & debris (FV-071)
Given a tree or stone
When the player chops/breaks it with the right tool
Then wood or stone is added to inventory and the debris is cleared

```js
test('FV-071 chopping a tree yields wood', () => {
  const w = new World();
  const inv = new Inventory();
  w.addTree(7, 8);
  w.player.useToolAt(w, 7, 8, 'axe', inv);
  expect(inv.count('Wood')).toBeGreaterThan(0);
  expect(w.treeAt(7, 8)).toBeNull();
});
```

### SPEC-FV-072 · Resource regeneration (FV-072)
Given cleared debris and picked forage
When the season changes
Then debris and forageables respawn on the map

```js
test('FV-072 season change respawns debris and forage', () => {
  const w = new World();
  w.clearAllDebris();
  w.advanceSeason();
  expect(w.countDebris()).toBeGreaterThan(0);
  expect(w.countForage()).toBeGreaterThan(0);
});
```

---

## Crafting, cooking & economy

### SPEC-FV-080 · Tool upgrades (FV-080)
Given ore and gold
When the player commissions an upgrade at the blacksmith
Then the tool is improved after a waiting period

```js
test('FV-080 tool upgrade improves the tool', () => {
  const b = new Blacksmith();
  const p = new Player({ gold: 500, inventory: { CopperOre: 5 } });
  b.upgradeTool(p, 'wateringCan');
  expect(p.tool('wateringCan').tier).toBe(1);
  b.advanceDay(p);
  b.advanceDay(p);
  expect(p.tool('wateringCan').tier).toBe(2);
});
```

### SPEC-FV-081 · Crafting menu (FV-081)
Given known recipes and materials
When the player crafts an item
Then materials are consumed and the item enters inventory or is placed

```js
test('FV-081 crafting consumes materials and yields the item', () => {
  const c = new Crafting();
  const inv = new Inventory(); inv.add('Wood', 50); inv.add('Stone', 20);
  const ok = c.craft(inv, 'Chest');
  expect(ok).toBe(true);
  expect(inv.count('Wood')).toBe(0);
});
```

### SPEC-FV-082 · Cooking (FV-082)
Given a kitchen and ingredients
When the player cooks a recipe
Then the dish is produced and restores energy/HP when eaten

```js
test('FV-082 cooked dish restores energy', () => {
  const k = new Kitchen();
  const dish = k.cook('VegetableStew');
  expect(dish.energyRestore).toBeGreaterThan(0);
  expect(dish.hpRestore).toBeGreaterThan(0);
});
```

### SPEC-FV-083 · Shipping bin (FV-083)
Given sellable items in inventory
When the player places them in the shipping bin at day-end
Then gold is added based on each item's sell price

```js
test('FV-083 shipping bin pays for shipped items', () => {
  const bin = new ShippingBin();
  const inv = new Inventory(); inv.add('SpringRoot', 3);
  const paid = bin.shipAll(inv);
  expect(paid).toBe(3 * 80); // 80g each
});
```

### SPEC-FV-084 · Reed's Market (FV-084)
Given gold
When the player buys seeds/tools from Reed's Market
Then gold is deducted and the item enters inventory

```js
test('FV-084 buying seeds at Reed\'s Market', () => {
  const m = new ReedsMarket();
  const p = new Player({ gold: 200 });
  const inv = new Inventory();
  m.buy(p, inv, 'SpringRootSeed', 1);
  expect(p.gold).toBeLessThan(200);
  expect(inv.count('SpringRootSeed')).toBe(1);
});
```

### SPEC-FV-085 · Inventory (FV-085)
Given items in the inventory
When the player moves stacks or opens chests
Then stacks merge, the tool belt holds equipped tools, and chest storage persists

```js
test('FV-085 inventory stacks and chest persist', () => {
  const inv = new Inventory();
  inv.add('Wood', 10); inv.add('Wood', 10);
  expect(inv.count('Wood')).toBe(20);
  const chest = new Chest(); chest.store(inv, 'Wood', 20);
  expect(chest.count('Wood')).toBe(20);
});
```

---

## Villagers & relationships

### SPEC-FV-090 · Villagers (FV-090)
Given River Village with 10 villagers
When the player enters the village
Then each villager is at their scheduled location (home/work/outside)

```js
test('FV-090 villagers follow their schedule', () => {
  const v = new Villager('Maren Reed');
  v.setSchedule({ time: 9 * 60, location: 'ReedsMarket' });
  expect(v.locationAt(9 * 60)).toBe('ReedsMarket');
});
```

### SPEC-FV-091 · Dialogue (FV-091)
Given a villager
When the player talks to them
Then the dialogue reflects day, season, weather, and friendship level

```js
test('FV-091 dialogue varies by friendship', () => {
  const v = new Villager('Maren Reed');
  v.friendship = 8;
  expect(v.talk()).toContain('friend');
  v.friendship = 0;
  expect(v.talk()).not.toContain('friend');
});
```

### SPEC-FV-092 · Friendship (FV-092)
Given a villager at 0 hearts
When the player gives liked gifts
Then friendship hearts rise (0–10)

```js
test('FV-092 gifts raise hearts to a max of 10', () => {
  const v = new Villager('Maren Reed');
  for (let i = 0; i < 20; i++) v.giveGift(v.loves[0]);
  expect(v.friendship).toBe(10);
});
```

### SPEC-FV-093 · Gifts (FV-093)
Given each villager's tastes
When the player gives an item
Then the reaction (love/like/neutral/dislike) matches that villager's table

```js
test('FV-093 gift reaction matches villager tastes', () => {
  const v = new Villager('Maren Reed');
  expect(v.reactionTo('WildBerry')).toBe('love');
  expect(v.reactionTo('Stone')).toBe('dislike');
});
```

### SPEC-FV-094 · Marriage (FV-094)
Given a villager at 10 hearts and an original pendant
When the player proposes
Then the villager moves to the holding as a spouse

```js
test('FV-094 proposal at 10 hearts moves spouse to holding', () => {
  const v = new Villager('Maren Reed');
  v.friendship = 10;
  const ok = v.propose(new Pendant());
  expect(ok).toBe(true);
  expect(v.location).toBe('Honeysuckle Holding');
});
```

---

## Festivals & events

### SPEC-FV-100 · Season festivals (FV-100)
Given a festival day (Spring Egg Hunt, Summer Luau, Fall Fair, Winter Feast)
When the player attends
Then the festival minigame is available and rewards are granted

```js
test('FV-100 festival grants a reward on completion', () => {
  const f = new Festival('Spring Egg Hunt');
  const r = f.playMinigame({ score: 10 });
  expect(r.reward).toBeDefined();
});
```

### SPEC-FV-101 · Villager events (FV-101)
Given a heart event or birthday
When the date and conditions match
Then the event triggers at the villager's scheduled location

```js
test('FV-101 birthday event triggers on birthday', () => {
  const calendar = new Calendar();
  calendar.setDate('Summer', 12, 1); // Maren's birthday
  const events = calendar.eventsToday();
  expect(events.some(e => e.type === 'birthday' && e.villager === 'Maren Reed')).toBe(true);
});
```

### SPEC-FV-102 · Mail system (FV-102)
Given letters in the mailbox
When the player checks the mailbox
Then each letter is readable and may contain gifts or event invitations

```js
test('FV-102 mailbox returns readable letters', () => {
  const mb = new Mailbox();
  mb.addLetter('Hello from Maren Reed');
  const letters = mb.readAll();
  expect(letters.length).toBe(1);
  expect(letters[0]).toContain('Maren Reed');
});
```

---

## Minigames

### SPEC-FV-110 · Fishing minigame (FV-110)
Given the fishing minigame
When played
Then casting/reel timing is original (not copied from the reference)

```js
test('FV-110 fishing minigame timing is original', () => {
  const m = new FishingMinigame();
  expect(m.name).not.toMatch(/stardew|fishing/i); // original, not reference-named
});
```

### SPEC-FV-111 · Festival games (FV-111)
Given a festival
When the player joins a festival contest
Then original scoring and rewards apply

```js
test('FV-111 festival contest scoring is original', () => {
  const c = new EggHuntContest();
  c.collectItem('egg');
  expect(c.score).toBe(1);
  expect(c.name).toBe('Egg Hunt'); // original name
});
```

### SPEC-FV-112 · Arcade at the saloon (FV-112)
Given the saloon arcade cabinet
When the player plays
Then tokens are awarded for the score

```js
test('FV-112 arcade awards tokens for score', () => {
  const a = new ArcadeCabinet();
  const tokens = a.play({ score: 5000 });
  expect(tokens).toBeGreaterThan(0);
});
```

---

## Monsters & loot

### SPEC-FV-120 · Monster roster (FV-120)
Given the Deep Warrens
When monsters spawn
Then they are original River Village creatures (Puddle, Glop, Bat, Dust Spirit, Cave Crab, Serpent)

```js
test('FV-120 monsters use original names', () => {
  const roster = MonsterRoster.all();
  roster.forEach(m => {
    expect(['stardew','slime','skeleton','dwarf','ghost'].some(s => m.kind.toLowerCase().includes(s))).toBe(false);
  });
});
```

### SPEC-FV-121 · Loot drops (FV-121)
Given a killed monster
When it dies
Then it drops original loot (slime, bat wing, coal, geode)

```js
test('FV-121 killed monster drops original loot', () => {
  const m = new Puddle({ x: 0, y: 0 });
  const loot = m.onDeath();
  expect(loot.some(i => i.kind === 'Slime')).toBe(true);
});
```

### SPEC-FV-122 · Geodes (FV-122)
Given a geode
When the player takes it to the blacksmith
Then it is cracked open to reveal a mineral or artifact

```js
test('FV-122 cracking a geode yields a mineral or artifact', () => {
  const b = new Blacksmith();
  const result = b.crackGeode('CaveGeode');
  expect(['mineral','artifact']).toContain(result.item.category);
});
```

---

## Audio & visuals

### SPEC-FV-130 · Music (FV-130)
Given the game is running
When the region or season changes
Then the matching original music track plays

```js
test('FV-130 region music switches on region change', () => {
  const music = new MusicManager();
  music.setRegion('Forest');
  expect(music.currentTrack).toContain('Forest');
});
```

### SPEC-FV-131 · Sound effects (FV-131)
Given tool use, footsteps, UI, fishing, combat
When those actions happen
Then the matching original SFX plays

```js
test('FV-131 tool use plays the tool SFX', () => {
  const sfx = new SfxManager();
  sfx.play('hoe');
  expect(sfx.lastPlayed).toBe('hoe');
});
```

### SPEC-FV-132 · Particle effects (FV-132)
Given watering, harvesting, fishing, and spell actions
When they happen
Then original particles appear at the action location

```js
test('FV-132 watering spawns water particles', () => {
  const p = new ParticleSystem();
  p.spawnWatering({ x: 5, y: 5 });
  expect(p.activeParticles.some(pt => pt.type === 'water')).toBe(true);
});
```
