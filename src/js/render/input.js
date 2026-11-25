const KEY_MAP = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

/**
 * Binds touch D-pad buttons and keyboard WASD/Arrow keys to movement callbacks.
 */
export class InputAdapter {
  constructor(onMove, onInteract) {
    this.onMove = onMove;
    this.onInteract = onInteract;

    window.addEventListener('keydown', (e) => {
      const dir = KEY_MAP[e.code];
      if (dir) {
        e.preventDefault();
        this.onMove(dir);
      } else if (e.code === 'Space' || e.code === 'Enter') {
        this.onInteract?.();
      }
    });

    document.querySelectorAll('.dpad-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.getAttribute('data-dir');
        if (dir) this.onMove(dir);
      });
    });

    const actBtn = document.getElementById('btn-interact');
    actBtn?.addEventListener('click', () => this.onInteract?.());
  }
}
