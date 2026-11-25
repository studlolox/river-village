export { Pendant } from './villager.js';

export function proposeMarriage(villager, pendant, holdingName = 'Honeysuckle Holding') {
  return villager.propose(pendant, holdingName);
}
