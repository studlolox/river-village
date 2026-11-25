export const CROP_DEFS = {
  springrootseed: { id: 'springRoot', produce: 'springRoot', days: 3, regrow: 0, sellPrice: 80, seedPrice: 20 },
  springroot: { id: 'springRoot', produce: 'springRoot', days: 3, regrow: 0, sellPrice: 80, seedPrice: 20 },
  sunmelonseed: { id: 'sunMelon', produce: 'sunMelon', days: 4, regrow: 0, sellPrice: 140, seedPrice: 40 },
  ambercornseed: { id: 'amberCorn', produce: 'amberCorn', days: 4, regrow: 2, sellPrice: 60, seedPrice: 50 },
  frostberryseed: { id: 'frostBerry', produce: 'frostBerry', days: 3, regrow: 2, sellPrice: 95, seedPrice: 35 },
};

export function resolveCropDef(seedOrCropId) {
  const key = String(seedOrCropId || '').toLowerCase();
  return CROP_DEFS[key] || { id: seedOrCropId, produce: seedOrCropId.replace(/Seed$/i, ''), days: 3, regrow: 0, sellPrice: 50, seedPrice: 20 };
}

/**
 * Represents a planted crop's growth state.
 */
export class Crop {
  constructor(seedOrCropId) {
    this.def = resolveCropDef(seedOrCropId);
    this.daysGrown = 0;
    this.stage = 'seed';
  }

  growOneDay() {
    if (this.stage === 'mature') return;
    this.daysGrown += 1;
    const ratio = this.daysGrown / this.def.days;
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
}
