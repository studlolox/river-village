/**
 * Original timing-based River Cast minigame.
 */
export class FishingMinigame {
  constructor(spot = 'River') {
    this.name = 'River Cast';
    this.spot = spot;
    this.timingHit = false;
  }

  resolve() {
    if (!this.timingHit) return null;
    const bySpot = {
      River: 'RiverDace',
      Beach: 'TidePerch',
      Lake: 'BrookTrout',
    };
    return {
      kind: bySpot[this.spot] || 'RiverDace',
      size: 18,
    };
  }
}
