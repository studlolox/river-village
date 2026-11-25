export const REGIONS = ['Holding', 'River Village', 'Beach', 'Forest', 'Mountains'];

export const REGION_WARPS = [
  { fromRegion: 'Holding', x: 24, y: 6, toRegion: 'Forest', toX: 1, toY: 6 },
  { fromRegion: 'Forest', x: 0, y: 6, toRegion: 'Holding', toX: 23, toY: 6 },
  { fromRegion: 'Holding', x: 12, y: 17, toRegion: 'Beach', toX: 12, toY: 1 },
  { fromRegion: 'Beach', x: 12, y: 0, toRegion: 'Holding', toX: 12, toY: 16 },
  { fromRegion: 'Holding', x: 0, y: 8, toRegion: 'River Village', toX: 22, toY: 8 },
  { fromRegion: 'River Village', x: 23, y: 8, toRegion: 'Holding', toX: 1, toY: 8 },
  { fromRegion: 'Forest', x: 12, y: 0, toRegion: 'Mountains', toX: 12, toY: 16 },
  { fromRegion: 'Mountains', x: 12, y: 17, toRegion: 'Forest', toX: 12, toY: 1 },
];
