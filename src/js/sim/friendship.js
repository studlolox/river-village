export const MAX_FRIENDSHIP = 10;

export function reactionPoints(reaction) {
  switch (reaction) {
    case 'love':
      return 2;
    case 'like':
      return 1;
    case 'dislike':
      return -1;
    default:
      return 0;
  }
}
