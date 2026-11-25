export class Schedule {
  constructor() {
    this.entries = [];
  }

  add(time, location) {
    this.entries.push({ time, location });
    this.entries.sort((a, b) => a.time - b.time);
  }

  locationAt(minutes) {
    let current = this.entries[0]?.location || 'Home';
    for (const entry of this.entries) {
      if (minutes >= entry.time) current = entry.location;
    }
    return current;
  }
}
