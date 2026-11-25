const GEODE_RESULTS = {
  CaveGeode: { id: 'RiverQuartz', category: 'mineral', sellPrice: 45 },
  FrostGeode: { id: 'GlacierShard', category: 'mineral', sellPrice: 75 },
  AncientGeode: { id: 'SunstoneRelic', category: 'artifact', sellPrice: 150 },
};

export function crackGeodeItem(geodeKind = 'CaveGeode') {
  return GEODE_RESULTS[geodeKind] || GEODE_RESULTS.CaveGeode;
}
