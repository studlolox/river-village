/**
 * Web Audio API synthesizer with mobile pointerdown unlock and settings integration.
 */
export class AudioEngine {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.unlocked = false;
  }

  unlock() {
    if (this.unlocked) return;
    const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioCtx) return;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  playTone(freq = 440, duration = 0.08, type = 'triangle', gainPeak = 0.08) {
    if (!this.settings?.isSfxEnabled?.() || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  playStep() {
    this.playTone(150, 0.045, 'sine', 0.04);
  }

  playUiClick() {
    this.playTone(580, 0.05, 'triangle', 0.06);
  }

  playSleepChime() {
    this.playTone(392, 0.14, 'sine', 0.07);
    setTimeout(() => this.playTone(523.25, 0.2, 'sine', 0.07), 120);
  }
}
