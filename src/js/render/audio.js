/**
 * Web Audio API synthesizer + SfxManager for tool, soil, harvest, and coin cues.
 */
export class SfxManager {
  constructor(settings = { isSfxEnabled: () => true }) {
    this.settings = settings;
    this.ctx = null;
    this.unlocked = false;
    this.lastPlayed = null;
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

  play(cue) {
    this.lastPlayed = cue;
    switch (cue) {
      case 'hoe':
        this.playTone(130, 0.07, 'square', 0.05);
        break;
      case 'water':
        this.playTone(320, 0.1, 'sine', 0.06);
        break;
      case 'plant':
        this.playTone(260, 0.06, 'triangle', 0.05);
        break;
      case 'harvest':
        this.playTone(523.25, 0.08, 'triangle', 0.07);
        setTimeout(() => this.playTone(659.25, 0.1, 'triangle', 0.07), 60);
        break;
      case 'coin':
        this.playTone(784, 0.07, 'sine', 0.07);
        setTimeout(() => this.playTone(1046.5, 0.12, 'sine', 0.07), 60);
        break;
      case 'step':
        this.playTone(150, 0.045, 'sine', 0.04);
        break;
      case 'ui':
        this.playTone(580, 0.05, 'triangle', 0.06);
        break;
      case 'sleep':
        this.playTone(392, 0.14, 'sine', 0.07);
        setTimeout(() => this.playTone(523.25, 0.2, 'sine', 0.07), 120);
        break;
      default:
        this.playTone(440, 0.05, 'sine', 0.04);
    }
  }

  playStep() { this.play('step'); }
  playUiClick() { this.play('ui'); }
  playSleepChime() { this.play('sleep'); }
}

export { SfxManager as AudioEngine };
