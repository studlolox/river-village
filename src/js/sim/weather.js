export const WEATHER_STATES = ['sunny', 'rainy', 'stormy', 'snowy'];

export class WeatherSystem {
  constructor(initial = 'sunny') {
    this.current = initial;
  }

  rollNext(season = 'Spring', rng = Math.random) {
    if (season === 'Winter') {
      this.current = rng() < 0.35 ? 'snowy' : 'sunny';
      return this.current;
    }
    const r = rng();
    if (r < 0.22) this.current = 'rainy';
    else if (r < 0.28 && season === 'Summer') this.current = 'stormy';
    else this.current = 'sunny';
    return this.current;
  }

  isRainy() {
    return this.current === 'rainy' || this.current === 'stormy';
  }
}
