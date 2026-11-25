const DIRECTION_DELTAS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  'up-left': [-1, -1],
  'up-right': [1, -1],
  'down-left': [-1, 1],
  'down-right': [1, 1]
};

/**
 * Player character profile created at game start.
 */
export class Character {
  constructor(name = 'Aria', holdingName = 'Honeysuckle Holding', appearance = {}) {
    this.name = name;
    this.holdingName = holdingName;
    this.appearance = {
      hairColor: appearance.hairColor || '#4a3525',
      shirtColor: appearance.shirtColor || '#3b7a57',
      skinTone: appearance.skinTone || '#f0c8a0'
    };
  }
}

/**
 * Player entity state: grid position, stats, tools, movement, and world/farm actions.
 */
export class Player {
  constructor(opts = {}) {
    this.name = opts.name || 'Aria';
    this.appearance = opts.appearance || {
      hairColor: '#4a3525',
      shirtColor: '#3b7a57',
      skinTone: '#f0c8a0'
    };
    const startX = opts.x ?? opts.gridPos?.x ?? 0;
    const startY = opts.y ?? opts.gridPos?.y ?? 0;
    this.gridPos = { x: startX, y: startY };
    this.facing = opts.facing || 'down';
    this.location = opts.location || 'Holding';
    this.gold = opts.gold ?? 500;
    this.maxEnergy = opts.maxEnergy ?? 100;
    this.energy = opts.energy ?? this.maxEnergy;
    this.maxHp = opts.maxHp ?? 100;
    this.hp = opts.hp ?? this.maxHp;
    this.equippedTool = opts.tool || 'hoe';
    this.tools = {
      hoe: { tier: opts.upgraded && this.equippedTool === 'hoe' ? 2 : 1 },
      wateringCan: { tier: opts.upgraded && this.equippedTool === 'wateringCan' ? 2 : 1 },
      axe: { tier: 1 },
      pickaxe: { tier: 1 },
      scythe: { tier: 1 }
    };
  }

  tool(name) {
    return this.tools[name] || null;
  }

  handleInput(direction, canWalkFn = null) {
    const delta = DIRECTION_DELTAS[direction];
    if (!delta) return false;
    this.facing = direction;
    const nx = this.gridPos.x + delta[0];
    const ny = this.gridPos.y + delta[1];
    if (canWalkFn && !canWalkFn(nx, ny)) {
      return false;
    }
    this.gridPos = { x: nx, y: ny };
    return true;
  }

  interactAt(world, x, y, inv) {
    if (world?.forage) {
      return world.forage.pick(x, y, inv);
    }
    return null;
  }

  useToolAt(target, x, y, toolOrInv = null, maybeInv = null) {
    const toolName = typeof toolOrInv === 'string' ? toolOrInv : this.equippedTool;
    const inv = typeof toolOrInv === 'string' ? maybeInv : toolOrInv;

    // World debris (axe / pickaxe)
    if (target?.debris) {
      if (toolName === 'axe') return target.debris.chopTree(x, y, inv);
      if (toolName === 'pickaxe') return target.debris.breakStone(x, y, inv);
    }

    // Mine nodes (Phase 4 hook)
    if (target?.mineNodeAt || target?.hitNode) {
      return target.hitNode(x, y, inv);
    }

    // Farm tiles (hoe / wateringCan, including 3x3 upgraded tier >= 2)
    if (target?.useTool) {
      const tier = this.tools[toolName]?.tier ?? 1;
      if (tier >= 2) {
        let any = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (target.useTool(x + dx, y + dy, toolName)) any = true;
          }
        }
        return any;
      }
      return target.useTool(x, y, toolName);
    }

    return false;
  }
}
