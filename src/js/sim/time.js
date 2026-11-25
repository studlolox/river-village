export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
export const DAYS_PER_SEASON = 28;
export const START_MINUTES = 6 * 60; // 06:00
export const PASS_OUT_MINUTES = 26 * 60; // 02:00 next day

/**
 * Tracks in-game clock (minutes from 00:00) and shop/lighting schedules.
 */
export class TimeOfDay {
  constructor(minutes = START_MINUTES) {
    this.minutes = minutes;
  }

  setMinutes(minutes) {
    this.minutes = Math.max(0, minutes);
  }

  advance(deltaMinutes) {
    this.minutes += deltaMinutes;
  }

  getHour() {
    return Math.floor((this.minutes % (24 * 60)) / 60);
  }

  getMinute() {
    return Math.floor(this.minutes % 60);
  }

  isPastTwoAM() {
    return this.minutes >= PASS_OUT_MINUTES;
  }

  format() {
    const h = this.getHour();
    const m = this.getMinute();
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  }

  /**
   * Returns normalized daylight factor in [0.2, 1.0] for scene lighting.
   */
  daylightFactor() {
    if (this.minutes < 7 * 60) return 0.65;
    if (this.minutes < 17 * 60) return 1.0;
    if (this.minutes < 20 * 60) {
      const t = (this.minutes - 17 * 60) / (3 * 60);
      return 1.0 - 0.65 * t;
    }
    return 0.35;
  }
}

export const ReedsMarket = {
  name: "Reed's Market",
  owner: 'Maren Reed',
  openMinutes: 9 * 60,
  closeMinutes: 17 * 60,
  isOpen(timeOfDay) {
    const mins = typeof timeOfDay === 'number' ? timeOfDay : timeOfDay.minutes;
    return mins >= this.openMinutes && mins < this.closeMinutes;
  },
};
