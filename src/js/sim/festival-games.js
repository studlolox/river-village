export class EggHuntContest {
  constructor() {
    this.name = 'Egg Hunt';
    this.score = 0;
  }

  collectItem(itemKind) {
    if (itemKind === 'egg') {
      this.score += 1;
    }
    return this.score;
  }
}
