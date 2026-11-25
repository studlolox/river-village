import { describe, test, expect } from 'vitest';
import { Mailbox } from '../js/sim/mail.js';

describe('SPEC-FV-102', () => {
  test('FV-102 mailbox returns readable letters', () => {
    const mb = new Mailbox();
    mb.addLetter('Hello from Maren Reed');
    const letters = mb.readAll();
    expect(letters.length).toBe(1);
    expect(letters[0]).toContain('Maren Reed');
  });
});
