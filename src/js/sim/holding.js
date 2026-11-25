/**
 * Represents the player's holding map: tillable soil, trees, and building plots.
 */
export class HoldingMap {
  constructor(width = 24, height = 18) {
    this.width = width;
    this.height = height;
    this.tiles = new Map();
    this.buildingPlots = [
      { id: 'plot-north-west', x: 4, y: 3, width: 4, height: 3, building: null },
      { id: 'plot-north-east', x: 14, y: 3, width: 4, height: 3, building: null },
    ];
    this._generateDefaultMap();
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  _generateDefaultMap() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let kind = 'grass';
        if (x >= 6 && x <= 17 && y >= 7 && y <= 14) {
          kind = 'tillable';
        }
        this.tiles.set(this._key(x, y), { x, y, kind, watered: false, crop: null });
      }
    }
    const treeCoords = [
      [2, 2], [3, 12], [20, 4], [21, 13], [19, 10],
    ];
    for (const [tx, ty] of treeCoords) {
      this.tiles.set(this._key(tx, ty), { x: tx, y: ty, kind: 'tree', watered: false, crop: null });
    }
    // Cottage / bedroom door tile
    this.tiles.set(this._key(11, 4), { x: 11, y: 4, kind: 'cottage', watered: false, crop: null });
  }

  tileAt(x, y) {
    return this.tiles.get(this._key(x, y)) || null;
  }

  countTiles(kind) {
    let count = 0;
    for (const tile of this.tiles.values()) {
      if (tile.kind === kind) count++;
    }
    return count;
  }

  emptyBuildingPlots() {
    return this.buildingPlots.filter((p) => p.building === null);
  }
}
