const PRODUCT_BY_KIND = {
  RiverHen: 'Egg',
  BrookDuck: 'DuckEgg',
  WoolyEwe: 'Wool',
  MeadowCow: 'Milk',
  MossGoat: 'GoatMilk',
};

/**
 * Represents a farm animal with affection, care state, naming, and product output.
 */
export class Animal {
  constructor(kind = 'RiverHen', name = '') {
    this.kind = kind;
    this.name = name || kind;
    this.fed = false;
    this.petted = false;
    this.affection = 0;
  }

  feed() {
    this.fed = true;
    this.affection = Math.min(100, this.affection + 1);
  }

  pet() {
    this.petted = true;
    this.affection = Math.min(100, this.affection + 1);
  }

  collectProduct() {
    if (!this.fed) return null;
    const base = PRODUCT_BY_KIND[this.kind] || 'Egg';
    this.fed = false;
    if (this.affection >= 10) {
      return { kind: base, quality: 'large' };
    }
    return base;
  }

  uiLabel() {
    return this.name || this.kind;
  }
}
