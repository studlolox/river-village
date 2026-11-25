import { Player } from './player.js';

const ORE_DROPS = {
  copper: 'CopperOre',
  iron: 'IronOre',
  gold: 'GoldOre',
};

/**
 * Deep Warrens dungeon state: floors, checkpoints, ore nodes, monsters, and ladders.
 */
export class Mine {
  constructor() {
    this.floor = 1;
    this.checkpoint = 0;
    this.player = new Player({ x: 1, y: 1, location: 'The Deep Warrens' });
    this.nodes = new Map();
    this.monsters = [];
    this.ladderPos = { x: 8, y: 8 };
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  enter(floor = 1) {
    this.floor = floor;
    this.player.location = 'The Deep Warrens';
    this.player.gridPos = { x: 1, y: 1 };
    if (floor % 5 === 0) {
      this.checkpoint = floor;
    }
  }

  addNode(x, y, oreType = 'copper') {
    this.nodes.set(this._key(x, y), { x, y, oreType });
  }

  nodeAt(x, y) {
    return this.nodes.get(this._key(x, y)) || null;
  }

  mineNode(x, y, inventory) {
    const k = this._key(x, y);
    const node = this.nodes.get(k);
    if (!node) return false;
    this.nodes.delete(k);
    const drop = ORE_DROPS[node.oreType] || 'Stone';
    inventory?.add(drop, 1);
    return true;
  }

  addMonster(monster) {
    this.monsters.push(monster);
  }

  updateContacts() {
    for (const m of this.monsters) {
      if (!m.dead && m.gridPos.x === this.player.gridPos.x && m.gridPos.y === this.player.gridPos.y) {
        this.player.hp = Math.max(0, this.player.hp - m.damage);
      }
    }
  }

  descend() {
    this.floor += 1;
    if (this.floor % 5 === 0) {
      this.checkpoint = this.floor;
    }
    this.nodes.clear();
    this.monsters = [];
    this.ladderPos = { x: 8, y: 8 };
  }
}
