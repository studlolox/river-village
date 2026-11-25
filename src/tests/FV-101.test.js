import { describe, test, expect } from 'vitest';
import { Calendar } from '../js/sim/events.js';

describe('SPEC-FV-101', () => {
  test('FV-101 birthday event triggers on birthday', () => {
    const calendar = new Calendar();
    calendar.setDate('Summer', 12, 1);
    const events = calendar.eventsToday();
    expect(events.some((e) => e.type === 'birthday' && e.villager === 'Maren Reed')).toBe(true);
  });
});
