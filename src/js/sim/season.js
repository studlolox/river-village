export const SEASON_ORDER = ['Spring', 'Summer', 'Fall', 'Winter'];

export const SEASON_PALETTES = {
  Spring: { ground: '#5a9e56', sky: '#203b2c' },
  Summer: { ground: '#63a845', sky: '#244732' },
  Fall: { ground: '#b57b3c', sky: '#3a2b1d' },
  Winter: { ground: '#c8dbe0', sky: '#233442' }
};

export function nextSeason(current) {
  const idx = SEASON_ORDER.indexOf(current);
  return SEASON_ORDER[(idx + 1) % SEASON_ORDER.length];
}
