/**
 * Handles floating virtual thumbstick, tap-on-tile, and WASD/arrow keyboard movement.
 */
export class InputController {
  constructor(canvas, thumbZone, onMove, onTapTile, onUnlockAudio) {
    this.canvas = canvas;
    this.thumbZone = thumbZone;
    this.onMove = onMove;
    this.onTapTile = onTapTile;
    this.onUnlockAudio = onUnlockAudio;

    this._activeDir = null;
    this._moveCooldown = 0;
    this._stickPointerId = null;
    this._stickOrigin = { x: 0, y: 0 };
    this._knob = thumbZone?.querySelector('.thumbstick-knob') || null;

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.onUnlockAudio?.();
      const dir = this._keyToDir(e.key);
      if (dir) {
        e.preventDefault();
        this.onMove(dir);
      }
    });

    if (this.thumbZone) {
      this.thumbZone.addEventListener('pointerdown', (e) => {
        this.onUnlockAudio?.();
        this._stickPointerId = e.pointerId;
        const rect = this.thumbZone.getBoundingClientRect();
        this._stickOrigin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        this.thumbZone.setPointerCapture?.(e.pointerId);
        this._updateStick(e.clientX, e.clientY);
      });

      this.thumbZone.addEventListener('pointermove', (e) => {
        if (e.pointerId !== this._stickPointerId) return;
        this._updateStick(e.clientX, e.clientY);
      });

      const endStick = (e) => {
        if (e.pointerId !== this._stickPointerId) return;
        this._stickPointerId = null;
        this._activeDir = null;
        if (this._knob) {
          this._knob.style.transform = 'translate(0px, 0px)';
        }
      };
      this.thumbZone.addEventListener('pointerup', endStick);
      this.thumbZone.addEventListener('pointercancel', endStick);
    }

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => {
        this.onUnlockAudio?.();
        this.onTapTile?.(e.clientX, e.clientY);
      });
    }
  }

  _updateStick(cx, cy) {
    const dx = cx - this._stickOrigin.x;
    const dy = cy - this._stickOrigin.y;
    const dist = Math.hypot(dx, dy);
    const maxR = 36;
    const clamped = Math.min(dist, maxR);
    const angle = Math.atan2(dy, dx);

    if (this._knob) {
      const kx = Math.cos(angle) * clamped;
      const ky = Math.sin(angle) * clamped;
      this._knob.style.transform = `translate(${kx}px, ${ky}px)`;
    }

    if (dist < 12) {
      this._activeDir = null;
      return;
    }

    const deg = (angle * 180) / Math.PI;
    if (deg >= -22.5 && deg < 22.5) this._activeDir = 'right';
    else if (deg >= 22.5 && deg < 67.5) this._activeDir = 'down-right';
    else if (deg >= 67.5 && deg < 112.5) this._activeDir = 'down';
    else if (deg >= 112.5 && deg < 157.5) this._activeDir = 'down-left';
    else if (deg >= 157.5 || deg < -157.5) this._activeDir = 'left';
    else if (deg >= -157.5 && deg < -112.5) this._activeDir = 'up-left';
    else if (deg >= -112.5 && deg < -67.5) this._activeDir = 'up';
    else this._activeDir = 'up-right';
  }

  _keyToDir(key) {
    switch (key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        return 'up';
      case 's':
      case 'arrowdown':
        return 'down';
      case 'a':
      case 'arrowleft':
        return 'left';
      case 'd':
      case 'arrowright':
        return 'right';
      default:
        return null;
    }
  }

  tick(dt) {
    if (!this._activeDir) {
      this._moveCooldown = 0;
      return;
    }
    this._moveCooldown -= dt;
    if (this._moveCooldown <= 0) {
      this.onMove(this._activeDir);
      this._moveCooldown = 0.16;
    }
  }
}
