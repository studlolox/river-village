import cropsData from '../../assets/crops.json' with { type: 'json' };

const CROP_BY_KEY = new Map();
for (const crop of Object.values(cropsData)) {
  CROP_BY_KEY.set(crop.id.toLowerCase(), crop);
  CROP_BY_KEY.set(crop.seedId.toLowerCase(), crop);
}

export function getCropDef(idOrSeed) {
  return CROP_BY_KEY.get(String(idOrSeed).toLowerCase()) || cropsData.springRoot;
}

/**
 * Individual planted crop tracking growth stages (seed -> sprout -> young -> mature).
 */
export class Crop {
  constructor(idOrSeed) {
    const def = getCropDef(idOrSeed);
    this.id = def.id;
    this.seedId = def.seedId;
    this.name = def.name;
    this.daysToMature = def.daysToMature;
    this.regrowDays = def.regrowDays || 0;
    this.harvestYield = def.harvestYield || 1;
    this.daysGrown = 0;
    this.stage = 'seed';
  }

  advanceDay(wasWatered) {
    if (!wasWatered) return;
    if (this.daysGrown < this.daysToMature) {
      this.daysGrown += 1;
    }
    this._updateStage();
  }

  _updateStage() {
    const ratio = this.daysGrown / Math.max(1, this.daysToMature);
    if (ratio >= 1) {
      this.stage = 'mature';
    } else if (ratio >= 0.66) {
      this.stage = 'young';
    } else if (ratio >= 0.33) {
      this.stage = 'sprout';
    } else {
      this.stage = 'seed';
    }
  }

  isMature() {
    return this.stage === 'mature';
  }

  onHarvest() {
    if (!this.isMature()) return false;
    if (this.regrowDays > 0) {
      this.daysGrown = Math.max(0, this.daysToMature - this.regrowDays);
      this._updateStage();
      return true; // stays planted
    }
    return false; // removed
  }
}
