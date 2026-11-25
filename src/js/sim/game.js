import { Character, Player } from './player.js';
import { Holding } from './holding.js';
import { World } from './world.js';
import { TimeOfDay, START_MINUTES } from './time.js';
import { Settings } from './settings.js';
import { SaveManager } from './save.js';
import { Farm } from './farm.js';
import { Inventory } from './inventory.js';
import { Chest } from './chest.js';
import { ShippingBin } from './shipping.js';
import { ReedsMarket } from './shop.js';
import { EnergySystem } from './energy.js';
import { Onboarding } from './onboarding.js';

export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
export const DAYS_PER_SEASON = 28;

/**
 * Unified root simulation state for River Village.
 */
export class Game {
  constructor(character = new Character()) {
    this.character = character;
    this.holding = new Holding(character.holdingName);
    this.farm = new Farm(this.holding.map);
    this.player = new Player({
      name: character.name,
      appearance: character.appearance,
      x: 4,
      y: 6,
      location: 'Bedroom'
    });
    this.inventory = new Inventory({ springRootSeed: 3 });
    this.chest = new Chest();
    this.shippingBin = new ShippingBin();
    this.market = new ReedsMarket();
    this.onboarding = new Onboarding();
    this.world = new World(this.player, this.holding);
    this.timeOfDay = new TimeOfDay(START_MINUTES);
    this.date = { season: 'Spring', day: 1, year: 1 };
    this.settings = new Settings();
    this.saveManager = new SaveManager();
    this.started = false;
    this.paused = false;
  }

  get time() {
    return this.timeOfDay.minutes;
  }

  set time(minutes) {
    this.timeOfDay.setMinutes(minutes);
  }

  get energy() {
    return this.player.energy;
  }

  set energy(val) {
    this.player.energy = val;
  }

  get maxEnergy() {
    return this.player.maxEnergy;
  }

  get hp() {
    return this.player.hp;
  }

  set hp(val) {
    this.player.hp = val;
  }

  get maxHp() {
    return this.player.maxHp;
  }

  start() {
    this.started = true;
    this.date = { season: 'Spring', day: 1, year: 1 };
    this.timeOfDay.setMinutes(START_MINUTES);
    this.player.location = 'Bedroom';
  }

  sleep() {
    this.farm.advanceDay();
    const payout = this.shippingBin.shipAll();
    if (payout > 0) {
      this.player.gold += payout;
    }

    this.date.day += 1;
    if (this.date.day > DAYS_PER_SEASON) {
      this.date.day = 1;
      const idx = SEASONS.indexOf(this.date.season);
      const nextIdx = (idx + 1) % SEASONS.length;
      this.date.season = SEASONS[nextIdx];
      if (nextIdx === 0) {
        this.date.year += 1;
      }
    }
    this.player.energy = this.player.maxEnergy;
    this.player.hp = this.player.maxHp;
    this.timeOfDay.setMinutes(START_MINUTES);
    this.player.location = 'Bedroom';
  }

  handlePlayerDefeat() {
    if (this.player.hp <= 0) {
      this.player.location = 'Clinic';
      this.player.hp = Math.max(10, Math.floor(this.player.maxHp * 0.5));
      this.player.energy = Math.max(10, Math.floor(this.player.maxEnergy * 0.5));
    }
  }

  movePlayer(direction) {
    return this.player.handleInput(direction, (x, y) => this.holding.map.isWalkable(x, y));
  }

  /**
   * Smart context-aware farm interaction at (x, y) for touch & action button.
   */
  interactTile(x, y) {
    const tile = this.farm.tileAt(x, y);
    if (!tile) return { action: null };

    // 1. Harvest mature crop first
    if (tile.crop && tile.crop.isMature()) {
      const res = this.farm.harvest(x, y, this.inventory);
      if (res) return { action: 'harvest', item: res };
    }

    // 2. Use equipped tool or plant selected seed
    const tool = this.player.equippedTool;
    if (tool === 'seed') {
      if (this.farm.plant(x, y, 'springRootSeed', this.inventory)) {
        this.onboarding.markDone('plant');
        return { action: 'plant' };
      }
    }

    if (tool === 'hoe' && (tile.kind === 'tillable' || tile.kind === 'dirt')) {
      const cost = EnergySystem.costForTool('hoe');
      if (EnergySystem.consume(this.player, cost) && this.farm.useTool(x, y, 'hoe')) {
        this.onboarding.markDone('till');
        return { action: 'till' };
      }
    }

    if (tool === 'wateringCan' && tile.kind === 'tilled' && !tile.watered) {
      const cost = EnergySystem.costForTool('wateringCan');
      if (EnergySystem.consume(this.player, cost) && this.farm.water(x, y)) {
        this.onboarding.markDone('water');
        return { action: 'water' };
      }
    }

    // Smart tap fallback: if tilled & unplanted & has seeds, plant; if planted & unwatered, water
    if (tile.kind === 'tilled' && !tile.crop && this.inventory.has('springRootSeed', 1)) {
      if (this.farm.plant(x, y, 'springRootSeed', this.inventory)) {
        this.onboarding.markDone('plant');
        return { action: 'plant' };
      }
    }
    if (tile.kind === 'tilled' && tile.crop && !tile.watered) {
      const cost = EnergySystem.costForTool('wateringCan');
      if (EnergySystem.consume(this.player, cost) && this.farm.water(x, y)) {
        this.onboarding.markDone('water');
        return { action: 'water' };
      }
    }

    return { action: null };
  }

  toSaveState() {
    return {
      player: {
        name: this.player.name,
        appearance: this.player.appearance,
        gridPos: { ...this.player.gridPos },
        location: this.player.location,
        gold: this.player.gold,
        energy: this.player.energy,
        hp: this.player.hp
      },
      holdingName: this.holding.name,
      date: { ...this.date },
      time: this.time,
      inventory: this.inventory.entries(),
      tiles: this.holding.map.tiles
    };
  }

  loadSaveState(data) {
    if (!data) return false;
    if (data.player) {
      this.player.name = data.player.name ?? this.player.name;
      this.player.gridPos = { ...(data.player.gridPos || { x: 4, y: 6 }) };
      this.player.location = data.player.location ?? 'Holding';
      this.player.gold = data.player.gold ?? 500;
      this.player.energy = data.player.energy ?? this.player.maxEnergy;
      this.player.hp = data.player.hp ?? this.player.maxHp;
    }
    if (data.holdingName) this.holding.name = data.holdingName;
    if (data.date) this.date = { ...data.date };
    if (typeof data.time === 'number') this.time = data.time;
    if (Array.isArray(data.inventory)) {
      this.inventory.clear();
      for (const item of data.inventory) {
        this.inventory.add(item.id, item.qty);
      }
    }
    this.started = true;
    return true;
  }
}
