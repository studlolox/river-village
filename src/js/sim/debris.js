export class DebrisManager {
  constructor() {
    this.trees = new Map(); // "x,y" -> { x, y, hp }
    this.stones = new Map();
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  addTree(x, y, hp = 1) {
    this.trees.set(this._key(x, y), { x, y, hp });
  }

  treeAt(x, y) {
    return this.trees.get(this._key(x, y)) || null;
  }

  addStone(x, y, hp = 1) {
    this.stones.set(this._key(x, y), { x, y, hp });
  }

  stoneAt(x, y) {
    return this.stones.get(this._key(x, y)) || null;
  }

  chopTree(x, y, inv) {
    const key = this._key(x, y);
    const t = this.trees.get(key);
    if (!t) return false;
    t.hp -= 1;
    if (t.hp <= 0) {
      this.trees.delete(key);
      if (inv) inv.add('Wood', 5);
    }
    return true;
  }

  breakStone(x, y, inv) {
    const key = this._key(x, y);
    const s = this.stones.get(key);
    if (!s) return false;
    s.hp -= 1;
    if (s.hp <= 0) {
      this.stones.delete(key);
      if (inv) inv.add('Stone', 3);
    }
    return true;
  }

  clearAll() {
    this.trees.clear();
    this.stones.clear();
  }

  count() {
    return this.trees.size + this.stones.size;
  }

  respawn() {
    const treeSpots = [[2, 5], [7, 8], [18, 5], [20, 11]];
    const stoneSpots = [[3, 14], [16, 12]];
    for (const [x, y] of treeSpots) {
      if (!this.treeAt(x, y)) this.addTree(x, y);
    }
    for (const [x, y] of stoneSpots) {
      if (!this.stoneAt(x, y)) this.addStone(x, y);
    }
  }
}
