/**
 * Original River Village achievement & milestone registry.
 */
export const ACHIEVEMENT_DEFS = [
  { id: 'first_harvest', title: 'First Harvest', description: 'Harvest your first crop on the holding.' },
  { id: 'green_thumb', title: 'Green Thumb', description: 'Grow crops across a full season.' },
  { id: 'big_earner', title: 'Prosperous Holding', description: 'Accumulate 5,000g in earnings.' },
  { id: 'village_restorer', title: 'Village Restorer', description: 'Complete a Village Restoration Ledger milestone.' },
  { id: 'animal_friend', title: 'Animal Friend', description: 'Care for a barn or coop animal to high affection.' },
  { id: 'crafter', title: 'Handy Crafter', description: 'Craft your first utility item.' }
];

export class AchievementManager {
  constructor(initialUnlocked = []) {
    this.unlocked = new Set(initialUnlocked);
  }

  unlock(id) {
    if (!id) return false;
    this.unlocked.add(id);
    return true;
  }

  unlockAll() {
    for (const def of ACHIEVEMENT_DEFS) {
      this.unlocked.add(def.id);
    }
    return this.unlocked.size;
  }

  has(id) {
    return this.unlocked.has(id);
  }

  reset() {
    this.unlocked.clear();
  }

  list() {
    return ACHIEVEMENT_DEFS.map((def) => ({
      ...def,
      unlocked: this.unlocked.has(def.id)
    }));
  }

  toJSON() {
    return Array.from(this.unlocked);
  }

  fromJSON(arr) {
    this.unlocked = new Set(Array.isArray(arr) ? arr : []);
  }
}
