export function buildDialogue(villager, context = {}) {
  const { season = 'Spring', weather = 'sunny' } = context;
  if (villager.friendship >= 6) {
    return `Good to see you, my friend! Lovely ${weather} ${season} day in River Village.`;
  }
  return `Hello! Busy ${season} day today in River Village.`;
}
