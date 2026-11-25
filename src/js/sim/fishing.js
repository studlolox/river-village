export class Rod {
  constructor(tier = 1) {
    this.tier = tier;
  }
}

export class FishingSpot {
  constructor(spotName = 'River') {
    this.spotName = spotName;
  }

  cast(rod) {
    if (!rod) return { minigameActive: false, spot: this.spotName };
    return { minigameActive: true, spot: this.spotName, rodTier: rod.tier };
  }
}
