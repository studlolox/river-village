import { Player } from './player.js';
import { TimeOfDay, SEASONS, DAYS_PER_SEASON, START_MINUTES } from './time.js';
import { HoldingMap } from './holding.js';

/**
 * Player character customization & identity descriptor.
 */
export class Character {
  constructor(name = 'Aria', holdingName = 'Honeysuckle Holding', appearance = {}) {
    this.name = name;
    this.holdingName = holdingName;
    this.appearance = {
      hairColor: appearance.hairColor || '#5c3b28',
      outfitColor: appearance.outfitColor || '#3c7a57',
      skinTone: appearance.skinTone || '#e5b895',
    };
  }
}

/**
 * Core deterministic Game state machine.
 */
export class Game {
  constructor(character = new Character()) {
    this.character = character;
    this.player = new Player({
      name: character.name,
      x: 11,
      y: 6,
      location: 'Bedroom',
    });
    this.holding = {
      name: character.holdingName,
      map: new HoldingMap(),
    };
    this.date = { season: 'Spring', day: 1, year: 1 };
    this.clock = new TimeOfDay(START_MINUTES);
    this.started = false;
  }

  get time() {
    return this.clock.minutes;
  }

  set time(v) {
    this.clock.setMinutes(v);
  }

  get energy() {
    return this.player.energy;
  }

  set energy(v) {
    this.player.energy = v;
  }

  get maxEnergy() {
    return this.player.maxEnergy;
  }

  get hp() {
    return this.player.hp;
  }

  set hp(v) {
    this.player.hp = v;
  }

  get maxHp() {
    return this.player.maxHp;
  }

  start() {
    this.started = true;
    this.date = { season: 'Spring', day: 1, year: 1 };
    this.clock.setMinutes(START_MINUTES);
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
    this.clock.setMinutes(START_MINUTES);
    this.player.location = 'Bedroom';
  }

  tick(deltaMinutes) {
    this.clock.advance(deltaMinutes);
    if (this.clock.isPastTwoAM()) {
      this.sleep();
    }
  }

  handlePlayerDefeat() {
    if (this.player.hp <= 0) {
      this.player.location = 'Clinic';
      this.player.hp = Math.max(10, Math.floor(this.player.maxHp * 0.5));
      this.player.energy = Math.max(10, Math.floor(this.player.maxEnergy * 0.5));
      this.player.gold = Math.max(0, this.player.gold - 50);
    }
  }

  toJSON() {
    return {
      day: this.date.day,
      season: this.date.season,
      year: this.date.year,
      time: this.time,
      gold: this.player.gold,
      x: this.player.gridPos.x,
      y: this.player.gridPos.y,
      location: this.player.location,
      playerName: this.player.name,
      holdingName: this.holding.name,
      energy: this.player.energy,
      hp: this.player.hp,
    };
  }

  loadFromSave(data) {
    if (!data) return;
    if (data.day !== undefined) this.date.day = data.day;
    if (data.season !== undefined) this.date.season = data.season;
    if (data.year !== undefined) this.date.year = data.year;
    if (data.time !== undefined) this.time = data.time;
    if (data.gold !== undefined) this.player.gold = data.gold;
    if (data.x !== undefined && data.y !== undefined) {
      this.player.gridPos = { x: data.x, y: data.y };
    }
    if (data.location !== undefined) this.player.location = data.location;
    if (data.playerName !== undefined) this.player.name = data.playerName;
    if (data.holdingName !== undefined) this.holding.name = data.holdingName;
    if (data.energy !== undefined) this.player.energy = data.energy;
    if (data.hp !== undefined) this.player.hp = data.hp;
  }
}
