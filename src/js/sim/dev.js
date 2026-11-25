import { Animal } from './animal.js';
import { getRegionDef } from './region.js';
import { SEASONS } from './game.js';

const DEV_STORAGE_KEY = 'rv_dev_mode';

function resolveDefaultEnabled(storage, search) {
  if (typeof search === 'string' && search.includes('dev=1')) return true;
  if (storage && typeof storage.getItem === 'function') {
    return storage.getItem(DEV_STORAGE_KEY) === '1';
  }
  return false;
}

/**
 * Pure simulation Developer Console & Mode controller (FV-005).
 * Gated by explicit activation and supports commands up to Phase 3 plus forward-compatible hooks.
 */
export class DevConsole {
  constructor(game, options = {}) {
    this.game = game;
    this.storage = options.storage ?? (typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : null);
    const search = options.search ?? (typeof globalThis.location !== 'undefined' ? globalThis.location.search : '');
    this.enabled = typeof options.enabled === 'boolean'
      ? options.enabled
      : resolveDefaultEnabled(this.storage, search);
    this.history = [];
    this.fpsOverlay = false;
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (this.storage && typeof this.storage.setItem === 'function') {
      try {
        this.storage.setItem(DEV_STORAGE_KEY, this.enabled ? '1' : '0');
      } catch {
        // Ignore storage quota / private-mode errors
      }
    }
    return this.enabled;
  }

  _requireEnabled() {
    if (!this.enabled) {
      throw new Error('Developer mode is disabled. Enable via ?dev=1, rv_dev_mode, or Settings.');
    }
  }

  /**
   * Execute a dev console command string (e.g. "addGold 500").
   */
  exec(commandLine) {
    this._requireEnabled();
    const trimmed = String(commandLine || '').trim();
    if (!trimmed) return { ok: false, message: 'Empty command.' };

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const result = this._dispatch(cmd, args);
    this.history.push({ command: trimmed, ...result });
    return result;
  }

  _dispatch(cmd, args) {
    const g = this.game;

    switch (cmd) {
      case 'help':
        return { ok: true, message: this.listCommands().join(', ') };

      // --- Economy & Items ---
      case 'addGold': {
        const amt = Number(args[0] ?? 500);
        if (!Number.isFinite(amt)) return { ok: false, message: 'Invalid gold amount.' };
        g.player.gold = Math.max(0, g.player.gold + amt);
        return { ok: true, message: `Gold: ${g.player.gold}g` };
      }
      case 'setGold': {
        const amt = Number(args[0] ?? 500);
        if (!Number.isFinite(amt)) return { ok: false, message: 'Invalid gold amount.' };
        g.player.gold = Math.max(0, amt);
        return { ok: true, message: `Gold set to ${g.player.gold}g` };
      }
      case 'giveItem': {
        const itemId = args[0];
        const qty = Math.max(1, Number(args[1] ?? 1) || 1);
        if (!itemId) return { ok: false, message: 'Usage: giveItem <itemId> [qty]' };
        g.inventory.add(itemId, qty);
        return { ok: true, message: `Added ${qty}x ${itemId}` };
      }
      case 'clearInventory':
        g.inventory.clear();
        return { ok: true, message: 'Inventory cleared.' };
      case 'fillEnergy':
        g.player.energy = g.player.maxEnergy;
        g.player.hp = g.player.maxHp;
        return { ok: true, message: `Energy ${g.player.energy}/${g.player.maxEnergy}, HP ${g.player.hp}/${g.player.maxHp}` };
      case 'godMode': {
        const next = args[0] === undefined ? !g.player.godMode : (args[0] === 'true' || args[0] === 'on' || args[0] === '1');
        g.player.godMode = next;
        if (next) {
          g.player.energy = g.player.maxEnergy;
          g.player.hp = g.player.maxHp;
        }
        return { ok: true, message: `God mode ${next ? 'ON' : 'OFF'}` };
      }

      // --- Time, Weather & World ---
      case 'setTime': {
        const raw = args[0] || '12:00';
        let mins = 720;
        if (raw.includes(':')) {
          const [hh, mm] = raw.split(':').map(Number);
          mins = (hh * 60) + (mm || 0);
        } else {
          mins = Number(raw);
        }
        if (!Number.isFinite(mins)) return { ok: false, message: 'Invalid time.' };
        g.timeOfDay.setMinutes(mins);
        return { ok: true, message: `Time set to ${g.timeOfDay.format()}` };
      }
      case 'advanceDays': {
        const days = Math.max(1, Number(args[0] ?? 1) || 1);
        for (let i = 0; i < days; i++) {
          g.sleep();
        }
        return { ok: true, message: `Advanced ${days} day(s) → ${g.date.season} ${g.date.day}, Year ${g.date.year}` };
      }
      case 'setSeason': {
        const season = args[0];
        if (!SEASONS.includes(season)) {
          return { ok: false, message: `Season must be one of: ${SEASONS.join(', ')}` };
        }
        g.date.season = season;
        g.world.season = season;
        g.world.forage.respawn(season);
        return { ok: true, message: `Season set to ${season}` };
      }
      case 'setWeather': {
        const weather = args[0] || 'sunny';
        if (!['sunny', 'rainy', 'stormy'].includes(weather)) {
          return { ok: false, message: 'Weather must be sunny, rainy, or stormy.' };
        }
        g.weather.current = weather;
        g.farm.weather = weather;
        return { ok: true, message: `Weather set to ${weather}` };
      }
      case 'teleport': {
        const region = args[0] || 'Holding';
        const def = getRegionDef(region);
        if (!def) return { ok: false, message: `Unknown region: ${region}` };
        const x = Number.isFinite(Number(args[1])) ? Number(args[1]) : Math.floor(def.width / 2);
        const y = Number.isFinite(Number(args[2])) ? Number(args[2]) : Math.floor(def.height / 2);
        g.world.setRegion(region);
        g.player.gridPos = { x, y };
        return { ok: true, message: `Teleported to ${region} (${x}, ${y})` };
      }
      case 'waterAllCrops': {
        let count = 0;
        for (const t of g.holding.map.tiles) {
          if (t.kind === 'tilled') {
            t.watered = true;
            count++;
          }
        }
        return { ok: true, message: `Watered ${count} tilled tiles.` };
      }
      case 'growAllCrops': {
        let grown = 0;
        for (const t of g.holding.map.tiles) {
          if (t.crop) {
            t.crop.daysGrown = t.crop.daysToMature;
            grown++;
          }
        }
        return { ok: true, message: `Matured ${grown} crops.` };
      }
      case 'clearDebris': {
        let cleared = 0;
        for (const t of g.holding.map.tiles) {
          if (t.object) {
            t.object = null;
            cleared++;
          }
        }
        g.world.clearAllDebris();
        return { ok: true, message: `Cleared ${cleared} holding obstacles & world debris.` };
      }

      // --- Animals & Buildings (Phase 3) ---
      case 'placeBuilding': {
        const type = args[0] || 'Coop';
        const x = Number(args[1] ?? 5);
        const y = Number(args[2] ?? 4);
        const b = g.holding.placeBuilding(type, x, y);
        return { ok: true, message: `Placed ${b.type} at (${b.x}, ${b.y})` };
      }
      case 'spawnAnimal': {
        const kind = args[0] || 'RiverHen';
        const name = args[1] || kind;
        const animal = new Animal(kind, name);
        g.animals.push(animal);
        return { ok: true, message: `Spawned ${animal.kind} "${animal.name}"` };
      }
      case 'feedAllAnimals': {
        for (const a of g.animals) a.feed();
        return { ok: true, message: `Fed ${g.animals.length} animal(s).` };
      }
      case 'maxAnimalHappiness': {
        for (const a of g.animals) {
          a.affection = 100;
          a.fedToday = true;
          a.pettedToday = true;
        }
        return { ok: true, message: `Maxed happiness for ${g.animals.length} animal(s).` };
      }

      // --- Storyline, Relationships & Achievements ---
      case 'completeOnboarding':
        g.onboarding.markDone('till');
        g.onboarding.markDone('plant');
        g.onboarding.markDone('water');
        g.onboarding.markDone('ship');
        g.onboarding.dismissed = true;
        return { ok: true, message: 'Onboarding completed.' };
      case 'advanceStoryline': {
        const milestoneId = args[0];
        if (!milestoneId) return { ok: false, message: 'Usage: advanceStoryline <milestoneId>' };
        g.quests.complete(milestoneId);
        return { ok: true, message: `Storyline/milestone "${milestoneId}" completed.` };
      }
      case 'unlockAllMilestones':
        for (const m of g.milestones.milestones) {
          m.completed = true;
          g.quests.complete(m.id);
        }
        return { ok: true, message: 'All Village Restoration milestones unlocked.' };
      case 'setFriendship': {
        const villagerId = args[0];
        const hearts = Number(args[1] ?? 10);
        if (!villagerId || !Number.isFinite(hearts)) {
          return { ok: false, message: 'Usage: setFriendship <villagerId> <hearts>' };
        }
        g.npcs.setHearts(villagerId, hearts);
        return { ok: true, message: `${villagerId} friendship: ${g.npcs.getHearts(villagerId)} hearts` };
      }
      case 'maxAllFriendships':
        g.npcs.maxAll();
        return { ok: true, message: 'All villager friendships set to 10 hearts.' };
      case 'unlockAchievement': {
        const id = args[0];
        if (!id) return { ok: false, message: 'Usage: unlockAchievement <id>' };
        g.achievements.unlock(id);
        return { ok: true, message: `Unlocked achievement "${id}".` };
      }
      case 'unlockAllAchievements': {
        const total = g.achievements.unlockAll();
        return { ok: true, message: `Unlocked all ${total} achievements.` };
      }
      case 'resetAchievements':
        g.achievements.reset();
        return { ok: true, message: 'Achievements reset.' };

      // --- QA / State Inspection ---
      case 'inspectState': {
        const path = args[0];
        const target = path
          ? path.split('.').reduce((acc, k) => (acc != null ? acc[k] : undefined), g)
          : {
              date: g.date,
              time: g.timeOfDay.format(),
              region: g.world.currentRegion,
              gold: g.player.gold,
              energy: g.player.energy,
              animals: g.animals.length,
              achievements: g.achievements.toJSON()
            };
        return { ok: true, data: target, message: JSON.stringify(target) };
      }
      case 'exportSave':
        return { ok: true, message: JSON.stringify(g.toSaveState()) };
      case 'fpsOverlay': {
        const next = args[0] === undefined ? !this.fpsOverlay : (args[0] === 'true' || args[0] === 'on' || args[0] === '1');
        this.fpsOverlay = next;
        return { ok: true, message: `FPS overlay ${next ? 'ON' : 'OFF'}` };
      }

      default:
        return { ok: false, message: `Unknown command: ${cmd}. Run "help" for commands.` };
    }
  }

  listCommands() {
    return [
      'help',
      'addGold', 'setGold', 'giveItem', 'clearInventory', 'fillEnergy', 'godMode',
      'setTime', 'advanceDays', 'setSeason', 'setWeather', 'teleport',
      'waterAllCrops', 'growAllCrops', 'clearDebris',
      'placeBuilding', 'spawnAnimal', 'feedAllAnimals', 'maxAnimalHappiness',
      'completeOnboarding', 'advanceStoryline', 'unlockAllMilestones',
      'setFriendship', 'maxAllFriendships',
      'unlockAchievement', 'unlockAllAchievements', 'resetAchievements',
      'inspectState', 'exportSave', 'fpsOverlay'
    ];
  }

  autocomplete(prefix) {
    const p = String(prefix || '').toLowerCase();
    return this.listCommands().filter((c) => c.toLowerCase().startsWith(p));
  }
}
