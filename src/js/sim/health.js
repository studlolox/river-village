export class HealthSystem {
  constructor(player) {
    this.player = player;
  }

  damage(amount) {
    this.player.hp = Math.max(0, this.player.hp - amount);
    return this.player.hp === 0;
  }

  heal(amount) {
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
  }
}
