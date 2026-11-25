/**
 * Early WebAudio unlock and SFX stub for Phase 0.
 */
export class AudioStub {
  constructor(settings) {
    this.settings = settings;
    this.unlocked = false;
    this.ctx = null;
  }

  unlock() {
    if (this.unlocked) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
    this.unlocked = true;
  }

  playStep() {
    if (!this.settings.isSfxEnabled() || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = 140;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
}
