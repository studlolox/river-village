/**
 * Village Restoration Ledger linking regional deliveries to landmark repairs.
 */
export class VillageRestorationLedger {
  constructor() {
    this.milestones = [
      { id: 'bridgeRepair', title: 'East River Bridge', cost: { Wood: 50, Stone: 25 }, completed: false, reward: 'Shortcut to Forest' },
      { id: 'marketStall', title: 'Village Market Canopy', cost: { Wood: 30, springRoot: 5 }, completed: false, reward: '10% Seed Discount' },
      { id: 'mineCart', title: 'Mountains Mine Cart', cost: { Stone: 40 }, completed: false, reward: 'Fast Travel to Mountains' }
    ];
  }

  completeMilestone(id, inv) {
    const m = this.milestones.find((item) => item.id === id);
    if (!m || m.completed) return false;
    for (const [itemId, qty] of Object.entries(m.cost)) {
      if (!inv.has(itemId, qty)) return false;
    }
    for (const [itemId, qty] of Object.entries(m.cost)) {
      inv.remove(itemId, qty);
    }
    m.completed = true;
    return true;
  }
}
