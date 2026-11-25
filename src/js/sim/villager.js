import { Schedule } from './schedule.js';
import { buildDialogue } from './dialogue.js';
import { MAX_FRIENDSHIP, reactionPoints } from './friendship.js';

export class Pendant {
  constructor(name = 'Riverstone Pendant') {
    this.name = name;
  }
}

/**
 * Represents a River Village resident with schedule, tastes, dialogue, friendship, and marriage.
 */
export class Villager {
  constructor(name = 'Maren Reed') {
    this.name = name;
    this.schedule = new Schedule();
    this.location = 'River Village';
    this.friendship = 0;
    this.married = false;
    this.loves = ['WildBerry', 'SpringRoot'];
    this.likes = ['Egg', 'RiverDace'];
    this.dislikes = ['Stone', 'Slime'];
  }

  setSchedule(entry) {
    this.schedule.add(entry.time, entry.location);
  }

  locationAt(minutes) {
    return this.schedule.locationAt(minutes);
  }

  talk(context = {}) {
    return buildDialogue(this, context);
  }

  reactionTo(itemKind) {
    if (this.loves.includes(itemKind)) return 'love';
    if (this.likes.includes(itemKind)) return 'like';
    if (this.dislikes.includes(itemKind)) return 'dislike';
    return 'neutral';
  }

  giveGift(itemKind) {
    const reaction = this.reactionTo(itemKind);
    const delta = reactionPoints(reaction);
    this.friendship = Math.max(0, Math.min(MAX_FRIENDSHIP, this.friendship + delta));
    return reaction;
  }

  propose(pendant, holdingName = 'Honeysuckle Holding') {
    if (!pendant || this.friendship < MAX_FRIENDSHIP) return false;
    this.married = true;
    this.location = holdingName;
    return true;
  }
}
