/**
 * Procedural Web Audio Engine for THE QUIET
 * Translates haptic signals, proximity beacons, and sensory overloads into auditory representations
 * Works seamlessly in Google Chrome, ChromeOS, and Android WebView.
 */
class QuietAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterGain = null;
    this.tinnitusOsc = null;
    this.tinnitusGain = null;
    this.noiseNode = null;
    this.isTinnitusActive = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAudio(state) {
    this.enabled = typeof state === 'boolean' ? state : !this.enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.enabled ? 0.7 : 0, this.ctx.currentTime);
    }
    return this.enabled;
  }

  /**
   * The Real Pulse: A warm 55Hz sub-bass thump that mirrors the primary haptic pulse.
   */
  pulse(isStrong = false) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = isStrong ? 65 : 55;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

    const peak = isStrong ? 0.8 : 0.5;
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(peak, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Phantom Tap: A light double click with hollow high-mids, representing phantom haptics.
   */
  phantom() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    [0, 0.08].forEach(delay => {
      const t = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.04);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.05);
    });
  }

  /**
   * Resonant Chime: A calming major 7th chord triad when connecting with a person in Communicate mode.
   */
  connectChime(index = 0) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [
      [261.63, 329.63, 392.00], // C4, E4, G4
      [293.66, 369.99, 440.00], // D4, F#4, A4
      [329.63, 392.00, 493.88], // E4, G4, B4
      [349.23, 440.00, 523.25], // F4, A4, C5
      [392.00, 493.88, 587.33]  // G4, B4, D5
    ];
    const notes = chords[index % chords.length];
    const t = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.04);

      gain.gain.setValueAtTime(0.001, t + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.25, t + i * 0.04 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + i * 0.04);
      osc.stop(t + 1.3);
    });
  }

  /**
   * Tinnitus simulation: Continuous high-frequency sine tone (used in Empathy Lab)
   */
  setTinnitus(active) {
    if (!this.enabled && active) return;
    this.ensureContext();
    if (!this.ctx) return;

    if (active && !this.isTinnitusActive) {
      this.isTinnitusActive = true;
      this.tinnitusOsc = this.ctx.createOscillator();
      this.tinnitusGain = this.ctx.createGain();

      this.tinnitusOsc.type = 'sine';
      this.tinnitusOsc.frequency.setValueAtTime(8400, this.ctx.currentTime); // 8.4 kHz ringing

      this.tinnitusGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.tinnitusGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.0);

      this.tinnitusOsc.connect(this.tinnitusGain);
      this.tinnitusGain.connect(this.masterGain);
      this.tinnitusOsc.start();
    } else if (!active && this.isTinnitusActive) {
      this.isTinnitusActive = false;
      if (this.tinnitusGain) {
        this.tinnitusGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          if (this.tinnitusOsc) {
            this.tinnitusOsc.stop();
            this.tinnitusOsc.disconnect();
            this.tinnitusOsc = null;
          }
        }, 350);
      }
    }
  }
}

window.QuietAudio = new QuietAudioEngine();
