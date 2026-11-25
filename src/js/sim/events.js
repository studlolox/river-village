const BIRTHDAYS = [
  { season: 'Summer', day: 12, villager: 'Maren Reed' },
  { season: 'Fall', day: 4, villager: 'Bramwell Forge' },
  { season: 'Winter', day: 18, villager: 'Dr. Linnea Vance' },
  { season: 'Fall', day: 21, villager: 'Thistle' },
  { season: 'Spring', day: 9, villager: 'Rowan Pike' },
  { season: 'Summer', day: 24, villager: 'Cora Vale' },
  { season: 'Spring', day: 19, villager: 'Alden Moss' },
  { season: 'Winter', day: 7, villager: 'Sylvie Finch' },
  { season: 'Fall', day: 15, villager: 'Garrick Stone' },
  { season: 'Spring', day: 26, villager: 'Nora Wren' },
];

export class Calendar {
  constructor() {
    this.season = 'Spring';
    this.day = 1;
    this.year = 1;
  }

  setDate(season, day, year = 1) {
    this.season = season;
    this.day = day;
    this.year = year;
  }

  eventsToday() {
    const events = [];
    for (const b of BIRTHDAYS) {
      if (b.season === this.season && b.day === this.day) {
        events.push({ type: 'birthday', villager: b.villager });
      }
    }
    return events;
  }
}
