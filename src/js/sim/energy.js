/**
 * Manages player stamina expenditure and recovery.
 */
export class EnergySystem {
  constructor(player) {
    this.player = player;
  }

  spend(amount) {
    if (this.player.energy < amount) return false;
    this.player.energy -= amount;
    return true;
  }

  restore(amount) {
    this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + amount);
  }
}
