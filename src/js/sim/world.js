import { Player } from './player.js';
import { HoldingMap } from './holding.js';

/**
 * World container managing the current region, map, and warp tiles.
 */
export class World {
  constructor() {
    this.currentRegion = 'Holding';
    this.player = new Player({ x: 11, y: 6, location: 'Holding' });
    this.holdingMap = new HoldingMap();
    this.warps = [
      { fromRegion: 'Holding', x: 24, y: 6, toRegion: 'Forest', toX: 1, toY: 6 },
      { fromRegion: 'Forest', x: 0, y: 6, toRegion: 'Holding', toX: 23, toY: 6 },
    ];
  }

  update() {
    const warp = this.warps.find(
      (w) =>
        w.fromRegion === this.currentRegion &&
        w.x === this.player.gridPos.x &&
        w.y === this.player.gridPos.y
    );
    if (warp) {
      this.currentRegion = warp.toRegion;
      this.player.location = warp.toRegion;
      this.player.gridPos = { x: warp.toX, y: warp.toY };
    }
  }
}
