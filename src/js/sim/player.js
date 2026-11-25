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
 * Player character entity with grid movement, facing, stats, and tool/world actions.
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
    this.tools = {
      hoe: { tier: opts.upgraded && this.equippedTool === 'hoe' ? 2 : 1 },
      wateringCan: { tier: opts.upgraded && this.equippedTool === 'wateringCan' ? 2 : 1 },
      axe: { tier: 1 },
      pickaxe: { tier: 1 },
      sword: { tier: 1 },
      rod: { tier: 1 },
    };
    this.upgradedTools = new Set(opts.upgraded ? [this.equippedTool] : []);
    this.inventoryMap = opts.inventory || null;
    this.fishing = {
      level: 1,
      xp: 0,
      catchFish: () => {
        this.fishing.xp += 25;
        this.fishing.level = 1 + Math.floor(this.fishing.xp / 25);
      },
    };
  }

  tool(name) {
    return this.tools[name] || { tier: 1 };
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

  interactAt(target, x, y, inventory) {
    if (typeof target.pickForage === 'function') {
      return target.pickForage(x, y, inventory);
    }
    return false;
  }

  useToolAt(target, x, y, toolOrInv = null, maybeInv = null) {
    let toolName = this.equippedTool;
    let inv = maybeInv;
    if (typeof toolOrInv === 'string') {
      toolName = toolOrInv;
    } else if (toolOrInv && typeof toolOrInv.add === 'function') {
      inv = toolOrInv;
    }

    if (typeof target.useTool === 'function') {
      const area = this.upgradedTools.has(toolName) || this.tool(toolName).tier >= 2 ? 3 : 1;
      target.useTool(x, y, toolName, area);
      return true;
    }
    if (typeof target.mineNode === 'function' && toolName === 'pickaxe') {
      return target.mineNode(x, y, inv);
    }
    if (typeof target.chopTree === 'function' && toolName === 'axe') {
      return target.chopTree(x, y, inv);
    }
    return false;
  }

  attack(mine, monster) {
    const dmg = 15;
    if (typeof monster.takeDamage === 'function') {
      monster.takeDamage(dmg);
    } else {
      monster.hp = Math.max(0, monster.hp - dmg);
      if (monster.hp === 0) monster.dead = true;
    }
  }
}
