export class ArcadeCabinet {
  constructor(name = 'River Dash') {
    this.name = name;
  }

  play({ score = 0 } = {}) {
    return Math.max(0, Math.floor(score / 100));
  }
}
