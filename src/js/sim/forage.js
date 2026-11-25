export const SEASONAL_FORAGE = {
  Spring: ['SpringOnion', 'WildBerry', 'RiverCress'],
  Summer: ['SunHerb', 'WildBerry', 'SeaShell'],
  Fall: ['ForestMushroom', 'WildNut', 'AutumnFern'],
  Winter: ['WinterRoot', 'FrostCrystal']
};

export class ForageManager {
  constructor() {
    this.items = new Map(); // "x,y" -> { x, y, kind }
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  add(x, y, kind) {
    this.items.set(this._key(x, y), { x, y, kind });
  }

  at(x, y) {
    return this.items.get(this._key(x, y)) || null;
  }

  pick(x, y, inv) {
    const key = this._key(x, y);
    const item = this.items.get(key);
    if (!item) return null;
    if (inv) inv.add(item.kind, 1);
    this.items.delete(key);
    return item.kind;
  }

  clear() {
    this.items.clear();
  }

  count() {
    return this.items.size;
  }

  respawn(season = 'Spring') {
    const pool = SEASONAL_FORAGE[season] || SEASONAL_FORAGE.Spring;
    const spots = [[4, 5], [6, 12], [15, 7], [19, 14]];
    spots.forEach(([x, y], i) => {
      if (!this.at(x, y)) {
        this.add(x, y, pool[i % pool.length]);
      }
    });
  }
}
