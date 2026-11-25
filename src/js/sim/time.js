export const START_MINUTES = 6 * 60; // 06:00
export const END_MINUTES = 26 * 60; // 02:00 next day

/**
 * Tracks in-game time of day (06:00 to 02:00) and sun/moon lighting factor.
 */
export class TimeOfDay {
  constructor(minutes = START_MINUTES) {
    this.minutes = minutes;
  }

  setMinutes(minutes) {
    this.minutes = Math.max(START_MINUTES, Math.min(END_MINUTES, minutes));
  }

  advanceMinutes(delta) {
    this.setMinutes(this.minutes + delta);
    return this.isPastCurfew();
  }

  isPastCurfew() {
    return this.minutes >= END_MINUTES;
  }

  /**
   * Returns 0..1 daylight factor (1 at noon, ~0.2 at dusk/night).
   */
  sunFactor() {
    const hour = this.minutes / 60;
    if (hour <= 12) {
      return 0.45 + 0.55 * ((hour - 6) / 6);
    }
    if (hour <= 20) {
      return 1.0 - 0.65 * ((hour - 12) / 8);
    }
    return Math.max(0.18, 0.35 - 0.17 * ((hour - 20) / 6));
  }

  formatted() {
    const wrapped = this.minutes % (24 * 60);
    const h24 = Math.floor(wrapped / 60);
    const m = Math.floor(wrapped % 60);
    const period = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  }
}

/**
 * Reed's Market hours facade (open 9:00 AM to 5:00 PM).
 */
export const ReedsMarketHours = {
  openMinutes: 9 * 60,
  closeMinutes: 17 * 60,
  isOpen(timeOfDay) {
    const mins = typeof timeOfDay === 'number' ? timeOfDay : timeOfDay.minutes;
    return mins >= this.openMinutes && mins < this.closeMinutes;
  }
};
