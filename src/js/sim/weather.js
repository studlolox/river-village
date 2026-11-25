export const WEATHER_STATES = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];

export class WeatherSystem {
  constructor(initial = 'sunny') {
    this.current = initial;
  }

  rollForSeason(season, rng = Math.random) {
    const r = rng();
    if (season === 'Winter') {
      this.current = r < 0.35 ? 'snowy' : r < 0.65 ? 'cloudy' : 'sunny';
    } else if (season === 'Spring' || season === 'Fall') {
      this.current = r < 0.3 ? 'rainy' : r < 0.55 ? 'cloudy' : 'sunny';
    } else {
      this.current = r < 0.15 ? 'stormy' : r < 0.3 ? 'rainy' : 'sunny';
    }
    return this.current;
  }
}
