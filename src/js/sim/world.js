import { Player } from './player.js';
import { HoldingMap } from './holding.js';
import { REGION_WARPS } from './region.js';
import { SeasonSystem } from './season.js';
import { WeatherSystem } from './weather.js';
import { foragePoolForSeason } from './forage.js';
import { createDefaultDebris } from './debris.js';

/**
 * World container managing regions, warps, forageables, trees, debris, and seasons.
 */
export class World {
  constructor() {
    this.currentRegion = 'Holding';
    this.player = new Player({ x: 11, y: 6, location: 'Holding' });
    this.holdingMap = new HoldingMap();
    this.warps = REGION_WARPS;
    this.seasonSystem = new SeasonSystem('Spring');
    this.weatherSystem = new WeatherSystem('sunny');
    this.forageables = new Map();
    this.trees = new Map();
    this.debris = new Map();
    this._spawnInitialResources();
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  _spawnInitialResources() {
    const pool = foragePoolForSeason(this.seasonSystem.current);
    this.addForage(4, 5, pool[0]);
    this.addForage(14, 9, pool[1 % pool.length]);
    for (const d of createDefaultDebris()) {
      this.debris.set(this._key(d.x, d.y), d);
    }
  }

  update() {
    const warp = this.warps.find(
      (w) =>
        w.fromRegion === this.currentRegion &&
        w.x === this.player.gridPos.x &&
        w.y === this.player.gridPos.y
    );
    if (warp) {
      this.currentRegion = warp.toRegion;
      this.player.location = warp.toRegion;
      this.player.gridPos = { x: warp.toX, y: warp.toY };
    }
  }

  addForage(x, y, itemKind) {
    this.forageables.set(this._key(x, y), { x, y, kind: itemKind });
  }

  forageAt(x, y) {
    return this.forageables.get(this._key(x, y)) || null;
  }

  pickForage(x, y, inventory) {
    const k = this._key(x, y);
    const f = this.forageables.get(k);
    if (!f) return false;
    inventory?.add(f.kind, 1);
    this.forageables.delete(k);
    return true;
  }

  addTree(x, y) {
    this.trees.set(this._key(x, y), { x, y, kind: 'tree' });
  }

  treeAt(x, y) {
    return this.trees.get(this._key(x, y)) || null;
  }

  chopTree(x, y, inventory) {
    const k = this._key(x, y);
    if (!this.trees.has(k)) return false;
    this.trees.delete(k);
    inventory?.add('Wood', 5);
    return true;
  }

  clearAllDebris() {
    this.debris.clear();
    this.forageables.clear();
  }

  countDebris() {
    return this.debris.size;
  }

  countForage() {
    return this.forageables.size;
  }

  advanceSeason() {
    const nextSeason = this.seasonSystem.next();
    this.weatherSystem.rollForSeason(nextSeason);
    this._spawnInitialResources();
  }
}
