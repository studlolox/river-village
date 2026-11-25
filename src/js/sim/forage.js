export const SEASONAL_FORAGE = {
  Spring: ['SpringOnion', 'WildBerry'],
  Summer: ['WildBerry', 'SunFlower'],
  Fall: ['WildBerry', 'Chestnut'],
  Winter: ['WinterRoot', 'FrostCrystal'],
};

export function foragePoolForSeason(season) {
  return SEASONAL_FORAGE[season] || SEASONAL_FORAGE.Spring;
}
