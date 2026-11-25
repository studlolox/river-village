import { SEASONS } from './time.js';

export class SeasonSystem {
  constructor(season = 'Spring') {
    this.current = season;
  }

  next() {
    const idx = SEASONS.indexOf(this.current);
    this.current = SEASONS[(idx + 1) % SEASONS.length];
    return this.current;
  }
}
