import holdingMap from '../../assets/maps/holding.json' with { type: 'json' };
import villageMap from '../../assets/maps/village.json' with { type: 'json' };
import beachMap from '../../assets/maps/beach.json' with { type: 'json' };
import forestMap from '../../assets/maps/forest.json' with { type: 'json' };
import mountainsMap from '../../assets/maps/mountains.json' with { type: 'json' };

export const REGIONS = {
  Holding: holdingMap,
  RiverVillage: villageMap,
  Beach: beachMap,
  Forest: forestMap,
  Mountains: mountainsMap
};

export function getRegionDef(id) {
  return REGIONS[id] || REGIONS.RiverVillage;
}
