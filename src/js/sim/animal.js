import animalsData from '../../assets/animals.json' with { type: 'json' };

/**
 * Original River Village farm animal with feeding, petting, affection, and quality-scaled products.
 */
export class Animal {
  constructor(kind = 'RiverHen', name = null) {
    const def = animalsData[kind] || animalsData.RiverHen;
    this.kind = def.kind;
    this.housing = def.housing;
    this.productKind = def.product;
    this.name = name || def.kind;
    this.affection = 0;
    this.fedToday = false;
    this.pettedToday = false;
  }

  feed() {
    this.fedToday = true;
    this.affection = Math.min(100, this.affection + 5);
  }

  pet() {
    this.pettedToday = true;
    this.affection = Math.min(100, this.affection + 5);
  }

  newDay() {
    this.fedToday = false;
    this.pettedToday = false;
  }

  collectProduct() {
    if (!this.fedToday && this.affection < 10) return null;
    const quality = this.affection >= 50 ? 'large' : 'standard';
    return { kind: this.productKind, quality };
  }

  uiLabel() {
    return this.name || this.kind;
  }
}
