export function collectLoot(inventory, lootList) {
  for (const item of lootList) {
    inventory?.add(item.kind, item.qty ?? 1);
  }
}
