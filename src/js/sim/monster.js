export class Monster {
  constructor({ kind, maxHp = 24, damage = 8, x = 0, y = 0, loot = [] }) {
    this.kind = kind;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.damage = damage;
    this.gridPos = { x, y };
    this.dead = false;
    this.loot = loot;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp === 0) {
      this.dead = true;
    }
  }

  onDeath() {
    this.dead = true;
    return this.loot;
  }
}

export class Puddle extends Monster {
  constructor(pos = { x: 0, y: 0 }) {
    super({
      kind: 'Puddle',
      maxHp: 24,
      damage: 8,
      x: pos.x,
      y: pos.y,
      loot: [{ kind: 'Slime', qty: 1 }],
    });
  }
}

export class Glop extends Monster {
  constructor(pos = { x: 0, y: 0 }) {
    super({ kind: 'Glop', maxHp: 36, damage: 12, x: pos.x, y: pos.y, loot: [{ kind: 'Slime', qty: 2 }] });
  }
}

export class Bat extends Monster {
  constructor(pos = { x: 0, y: 0 }) {
    super({ kind: 'Bat', maxHp: 28, damage: 10, x: pos.x, y: pos.y, loot: [{ kind: 'BatWing', qty: 1 }] });
  }
}

export class DustSpirit extends Monster {
  constructor(pos = { x: 0, y: 0 }) {
    super({ kind: 'Dust Spirit', maxHp: 40, damage: 14, x: pos.x, y: pos.y, loot: [{ kind: 'Coal', qty: 1 }] });
  }
}

export class CaveCrab extends Monster {
  constructor(pos = { x: 0, y: 0 }) {
    super({ kind: 'Cave Crab', maxHp: 50, damage: 15, x: pos.x, y: pos.y, loot: [{ kind: 'CopperOre', qty: 1 }] });
  }
}

export class Serpent extends Monster {
  constructor(pos = { x: 0, y: 0 }) {
    super({ kind: 'Serpent', maxHp: 65, damage: 20, x: pos.x, y: pos.y, loot: [{ kind: 'CaveGeode', qty: 1 }] });
  }
}

export const MonsterRoster = {
  all() {
    return [
      new Puddle(),
      new Glop(),
      new Bat(),
      new DustSpirit(),
      new CaveCrab(),
      new Serpent(),
    ];
  },
};
