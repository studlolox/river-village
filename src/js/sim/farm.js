import { HoldingMap } from './holding.js';
import { Crop } from './crop.js';

/**
 * Farming simulation over a HoldingMap (tilling, planting, watering, growth, harvesting).
 */
export class Farm {
  constructor(map = new HoldingMap()) {
    this.map = map;
    this.weather = 'sunny';
  }

  tileAt(x, y) {
    return this.map.tileAt(x, y);
  }

  setTile(x, y, kind) {
    const t = this.tileAt(x, y);
    if (!t) return false;
    t.kind = kind;
    t.modified = true;
    return true;
  }

  useTool(x, y, tool) {
    const t = this.tileAt(x, y);
    if (!t) return false;
    if (tool === 'hoe') {
      if ((t.kind === 'tillable' || t.kind === 'dirt' || t.kind === 'grass') && !t.object) {
        t.kind = 'tilled';
        t.modified = true;
        return true;
      }
      return false;
    }
    if (tool === 'wateringCan') {
      return this.water(x, y);
    }
    return false;
  }

  plant(x, y, seedId, inv) {
    const t = this.tileAt(x, y);
    if (!t || t.kind !== 'tilled' || t.crop) return false;
    if (inv && !inv.remove(seedId, 1)) return false;
    t.crop = new Crop(seedId);
    t.modified = true;
    return true;
  }

  addCropAt(pos, cropId) {
    const t = this.tileAt(pos.x, pos.y);
    if (!t) return false;
    t.kind = 'tilled';
    t.crop = new Crop(cropId);
    t.modified = true;
    return true;
  }

  water(x, y) {
    const t = this.tileAt(x, y);
    if (!t || t.kind !== 'tilled') return false;
    t.watered = true;
    t.modified = true;
    return true;
  }

  applyWeatherWatering() {
    if (this.weather !== 'rainy' && this.weather !== 'stormy') return;
    for (const t of this.map.tiles) {
      if (t.kind === 'tilled' || t.crop) {
        t.watered = true;
      }
    }
  }

  advanceDay() {
    this.applyWeatherWatering();
    for (const t of this.map.tiles) {
      if (t.crop) {
        t.crop.advanceDay(t.watered);
      }
      t.watered = false;
    }
  }

  harvest(x, y, inv) {
    const t = this.tileAt(x, y);
    if (!t || !t.crop || !t.crop.isMature()) return null;
    const produceId = t.crop.id;
    const qty = t.crop.harvestYield;
    if (inv) {
      inv.add(produceId, qty);
    }
    const regrows = t.crop.onHarvest();
    if (!regrows) {
      t.crop = null;
    }
    t.modified = true;
    return { id: produceId, qty };
  }
}
