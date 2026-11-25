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
 * Player entity state: grid position, stats, equipped tool, and movement.
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
}
