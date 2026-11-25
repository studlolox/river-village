export const HOLDING_WIDTH = 24;
export const HOLDING_HEIGHT = 20;

/**
 * Deterministic holding grid with tillable dirt, trees, rocks, river edge, and building plots.
 */
export class HoldingMap {
  constructor(width = HOLDING_WIDTH, height = HOLDING_HEIGHT) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.buildingPlots = [
      { id: 'plot-1', x: 5, y: 4, width: 4, height: 3, building: null },
      { id: 'plot-2', x: 11, y: 4, width: 4, height: 3, building: null }
    ];
    this._generate();
  }

  _generate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let kind = 'grass';
        // River along the bottom-most 2 rows
        if (y >= this.height - 2) {
          kind = 'water';
        } else if (x >= 4 && x <= 14 && y >= 8 && y <= 15) {
          // Central tillable dirt field
          kind = 'tillable';
        } else if (x >= 2 && x <= 4 && y >= 2 && y <= 3) {
          // Farmhouse footprint
          kind = 'house';
        }

        this.tiles.push({
          x,
          y,
          kind,
          object: null, // 'tree' | 'rock' | null
          watered: false,
          crop: null,
          modified: false
        });
      }
    }

    // Place starter trees along the west/east edges
    const treeCoords = [
      [1, 5], [1, 9], [1, 13], [2, 16],
      [18, 4], [19, 8], [20, 12], [21, 6]
    ];
    for (const [tx, ty] of treeCoords) {
      const tile = this.tileAt(tx, ty);
      if (tile && tile.kind === 'grass') {
        tile.object = 'tree';
      }
    }

    // Place a few starter stones
    const rockCoords = [[16, 10], [17, 14], [3, 12]];
    for (const [rx, ry] of rockCoords) {
      const tile = this.tileAt(rx, ry);
      if (tile && tile.kind === 'grass') {
        tile.object = 'rock';
      }
    }
  }

  inBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  tileAt(x, y) {
    if (!this.inBounds(x, y)) return null;
    return this.tiles[y * this.width + x];
  }

  isWalkable(x, y) {
    const t = this.tileAt(x, y);
    if (!t) return false;
    if (t.kind === 'water' || t.kind === 'house') return false;
    if (t.object === 'tree' || t.object === 'rock') return false;
    return true;
  }

  countTiles(kindOrObject) {
    let count = 0;
    for (const t of this.tiles) {
      if (t.kind === kindOrObject || t.object === kindOrObject) {
        count++;
      }
    }
    return count;
  }

  emptyBuildingPlots() {
    return this.buildingPlots.filter((p) => p.building === null);
  }
}

/**
 * Holding state combining name, map, and placed buildings.
 */
export class Holding {
  constructor(name = 'Honeysuckle Holding') {
    this.name = name;
    this.map = new HoldingMap();
    this.buildings = [];
  }
}
