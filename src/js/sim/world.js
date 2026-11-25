/**
 * World state managing regions and the active region.
 */
export class World {
  constructor(player = null, holding = null) {
    this.player = player;
    this.holding = holding;
    this.currentRegion = 'Holding';
  }

  setRegion(regionName) {
    this.currentRegion = regionName;
    if (this.player) {
      this.player.location = regionName;
    }
  }
}
