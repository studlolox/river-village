import { Character, Player } from './player.js';
import { Holding } from './holding.js';
import { World } from './world.js';
import { TimeOfDay, START_MINUTES } from './time.js';
import { Settings } from './settings.js';
import { SaveManager } from './save.js';

export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
export const DAYS_PER_SEASON = 28;

/**
 * Unified root simulation state for River Village.
 */
export class Game {
  constructor(character = new Character()) {
    this.character = character;
    this.holding = new Holding(character.holdingName);
    this.player = new Player({
      name: character.name,
      appearance: character.appearance,
      x: 4,
      y: 6,
      location: 'Bedroom'
    });
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

  movePlayer(direction) {
    return this.player.handleInput(direction, (x, y) => this.holding.map.isWalkable(x, y));
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
    this.started = true;
    return true;
  }
}
