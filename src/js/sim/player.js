const DIRECTION_DELTAS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
  'up-left': { dx: -1, dy: -1 },
  'up-right': { dx: 1, dy: -1 },
  'down-left': { dx: -1, dy: 1 },
  'down-right': { dx: 1, dy: 1 },
};

/**
 * Player character entity with grid movement, facing, stats, and tool state.
 */
export class Player {
  constructor(opts = {}) {
    this.name = opts.name || 'Aria';
    this.gridPos = { x: opts.x ?? 0, y: opts.y ?? 0 };
    this.facing = opts.facing || 'down';
    this.location = opts.location || 'Bedroom';
    this.gold = opts.gold ?? 500;
    this.maxHp = opts.maxHp ?? 100;
    this.hp = opts.hp ?? this.maxHp;
    this.maxEnergy = opts.maxEnergy ?? 100;
    this.energy = opts.energy ?? this.maxEnergy;
    this.equippedTool = opts.tool || 'hoe';
    this.upgradedTools = new Set(opts.upgraded ? [this.equippedTool] : []);
    this.fishing = { level: 1, xp: 0, catchFish: () => { this.fishing.xp += 25; this.fishing.level = 1 + Math.floor(this.fishing.xp / 25); } };
  }

  handleInput(input, bounds = null) {
    let delta;
    if (typeof input === 'string') {
      delta = DIRECTION_DELTAS[input];
    } else if (input && typeof input.dx === 'number' && typeof input.dy === 'number') {
      delta = { dx: Math.sign(input.dx), dy: Math.sign(input.dy) };
    }
    if (!delta) return false;

    if (delta.dy < 0) this.facing = 'up';
    else if (delta.dy > 0) this.facing = 'down';
    else if (delta.dx < 0) this.facing = 'left';
    else if (delta.dx > 0) this.facing = 'right';

    const nx = this.gridPos.x + delta.dx;
    const ny = this.gridPos.y + delta.dy;
    if (bounds) {
      if (nx < 0 || ny < 0 || nx >= bounds.width || ny >= bounds.height) {
        return false;
      }
    }
    this.gridPos = { x: nx, y: ny };
    return true;
  }

  targetTile() {
    const d = DIRECTION_DELTAS[this.facing] || { dx: 0, dy: 1 };
    return { x: this.gridPos.x + d.dx, y: this.gridPos.y + d.dy };
  }
}
