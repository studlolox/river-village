export function resolveMeleeAttack(attackerDamage, monster) {
  monster.takeDamage(attackerDamage);
  return monster.dead ? monster.onDeath() : [];
}
