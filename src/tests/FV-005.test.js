import { describe, test, expect } from 'vitest';
import { Game } from '../js/sim/game.js';
import { DevConsole } from '../js/sim/dev.js';

describe('SPEC-FV-005 Dev console & mode', () => {
  test('FV-005 dev console mutates gold, items, friendship, storyline, and achievements when enabled', () => {
    const game = new Game();
    const dev = new DevConsole(game, { enabled: false });
    expect(() => dev.exec('addGold 500')).toThrow();

    dev.setEnabled(true);
    dev.exec('addGold 500');
    dev.exec('giveItem spring_root 5');
    dev.exec('setFriendship maren_reed 6');
    dev.exec('advanceStoryline restoration_bridge');
    dev.exec('unlockAchievement first_harvest');

    expect(game.economy.gold).toBeGreaterThanOrEqual(500);
    expect(game.inventory.count('spring_root')).toBeGreaterThanOrEqual(5);
    expect(game.npcs.getHearts('maren_reed')).toBe(6);
    expect(game.quests.isCompleted('restoration_bridge')).toBe(true);
    expect(game.achievements.has('first_harvest')).toBe(true);
  });
});
