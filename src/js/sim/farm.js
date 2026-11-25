import { Crop } from './crop.js';

/**
 * Manages farm tiles, tilling, planting, watering, crop growth, and harvesting.
 */
export class Farm {
  constructor() {
    this.tiles = new Map();
    this.weather = 'sunny';
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  _ensureTile(x, y) {
    const k = this._key(x, y);
    if (!this.tiles.has(k)) {
      this.tiles.set(k, { x, y, kind: 'dirt', watered: false, crop: null });
    }
    return this.tiles.get(k);
  }

  setTile(x, y, kind) {
    const t = this._ensureTile(x, y);
    t.kind = kind;
  }

  tileAt(x, y) {
    return this._ensureTile(x, y);
  }

  useTool(x, y, tool, area = 1) {
    const radius = area > 1 ? 1 : 0;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const t = this._ensureTile(x + dx, y + dy);
        if (tool === 'hoe' && (t.kind === 'dirt' || t.kind === 'tillable' || t.kind === 'grass')) {
          t.kind = 'tilled';
        } else if (tool === 'wateringCan' && t.kind === 'tilled') {
          t.watered = true;
        }
      }
    }
  }

  plant(x, y, seedId, inventory = null) {
    const t = this._ensureTile(x, y);
    t.kind = 'tilled';
    if (inventory && inventory.count(seedId) > 0) {
      inventory.remove(seedId, 1);
    }
    t.crop = new Crop(seedId);
    return t.crop;
  }

  addCropAt(pos, cropId) {
    const t = this._ensureTile(pos.x, pos.y);
    t.kind = 'tilled';
    t.crop = new Crop(cropId);
    return t.crop;
  }

  water(x, y) {
    const t = this._ensureTile(x, y);
    t.watered = true;
  }

  applyWeatherWatering() {
    if (this.weather !== 'rainy' && this.weather !== 'stormy') return;
    for (const t of this.tiles.values()) {
      if (t.crop) {
        t.watered = true;
      }
    }
  }

  advanceDay() {
    if (this.weather === 'rainy' || this.weather === 'stormy') {
      this.applyWeatherWatering();
    }
    for (const t of this.tiles.values()) {
      if (t.crop && t.watered) {
        t.crop.growOneDay();
      }
      t.watered = false;
    }
  }

  harvest(x, y, inventory) {
    const t = this._ensureTile(x, y);
    if (!t.crop || t.crop.stage !== 'mature') return false;
    const produceId = t.crop.def.produce;
    if (inventory) {
      inventory.add(produceId, 1);
    }
    if (t.crop.def.regrow > 0) {
      t.crop.stage = 'young';
      t.crop.daysGrown = Math.max(0, t.crop.def.days - t.crop.def.regrow);
    } else {
      t.crop = null;
    }
    return true;
  }
}
