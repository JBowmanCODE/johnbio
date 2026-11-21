/**
 * Air Strings — Pure Web Audio Synthesis, Effects, Backing Beat & WAV Recorder
 * Zero external audio samples required. Low-latency procedural instruments:
 * Guitar (Karplus-Strong), Piano, Laser Harp, Cyberpunk Synth, 808 Bass,
 * Lo-Fi Chords, Full Drum Kit, and Latin Bongos & Percussion.
 */
(function (global) {
  'use strict';

  // ── Musical Theory: Notes, Frequencies & Scales ───────────────────────────
  const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const SCALES = {
    'pentatonic-minor': { label: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] },
    'pentatonic-major': { label: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9] },
    major: { label: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
    minor: { label: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
    dorian: { label: 'Dorian Groove', intervals: [0, 2, 3, 5, 7, 9, 10] },
    blues: { label: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
    hirajoshi: { label: 'Japanese Hirajoshi', intervals: [0, 2, 3, 7, 8] },
    chromatic: { label: 'Chromatic (All)', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  };

  const CHORD_VOICINGS = {
    Am7: ['A2', 'E3', 'G3', 'C4', 'E4'],
    Fmaj7: ['F2', 'C3', 'E3', 'A3', 'C4'],
    Cmaj7: ['C3', 'G3', 'B3', 'E4', 'G4'],
    G6: ['G2', 'D3', 'E3', 'B3', 'D4'],
    Dm7: ['D3', 'A3', 'C4', 'F4', 'A4'],
    Em7: ['E2', 'B2', 'D3', 'G3', 'B3'],
    Bbmaj7: ['A#2', 'F3', 'A3', 'D4', 'F4'],
    E7: ['E2', 'B2', 'D3', 'G#3', 'B3'],
    Fm7: ['F2', 'C3', 'D#3', 'G#3', 'C4'],
    Dbmaj7: ['C#3', 'G#3', 'C4', 'F4', 'G#4'],
  };

  const DRUM_VOICES = [
    { id: 'kick', label: 'Kick', short: 'KICK' },
    { id: 'snare', label: 'Snare', short: 'SNARE' },
    { id: 'hihat-closed', label: 'Hi-Hat (Closed)', short: 'CHH' },
    { id: 'hihat-open', label: 'Hi-Hat (Open)', short: 'OHH' },
    { id: 'clap', label: 'Clap', short: 'CLAP' },
    { id: 'tom-hi', label: 'High Tom', short: 'TOM HI' },
    { id: 'tom-low', label: 'Low Tom', short: 'TOM LO' },
    { id: 'crash', label: 'Crash Cymbal', short: 'CRASH' },
  ];

  const BONGO_VOICES = [
    { id: 'bongo-hi', label: 'Bongo High (Macho)', short: 'BONGO HI' },
    { id: 'bongo-lo', label: 'Bongo Low (Hembra)', short: 'BONGO LO' },
    { id: 'conga-slap', label: 'Conga Slap', short: 'CONGA SL' },
    { id: 'conga-open', label: 'Conga Open', short: 'CONGA OP' },
    { id: 'cowbell', label: '808 Cowbell', short: 'COWBELL' },
    { id: 'clave', label: 'Wood Clave', short: 'CLAVE' },
  ];

  const INSTRUMENTS = {
    guitar: { id: 'guitar', label: 'Guitar', color: '#00eefc', kind: 'melodic', defaultOctaves: [2, 4] },
    piano: { id: 'piano', label: 'Piano', color: '#ff3da6', kind: 'melodic', defaultOctaves: [3, 5] },
    harp: { id: 'harp', label: 'Laser Harp', color: '#34d399', kind: 'melodic', defaultOctaves: [3, 5] },
    synth: { id: 'synth', label: 'Neon Synth', color: '#38bdf8', kind: 'melodic', defaultOctaves: [3, 5] },
    bass: { id: 'bass', label: '808 Bass', color: '#c084fc', kind: 'melodic', defaultOctaves: [1, 3] },
    chords: { id: 'chords', label: 'Lo-Fi Chords', color: '#f472b6', kind: 'chord', voices: Object.keys(CHORD_VOICINGS) },
    drums: { id: 'drums', label: 'Drums', color: '#fbbf24', kind: 'percussion', voices: DRUM_VOICES },
    bongos: { id: 'bongos', label: 'Bongos & Perc', color: '#a3ff12', kind: 'percussion', voices: BONGO_VOICES },
  };

  function noteToMidi(noteStr) {
    const m = /^([A-G]#?)(-?\d)$/.exec(String(noteStr || 'C4').trim());
    if (!m) return 60;
    const idx = NOTE_NAMES.indexOf(m[1]);
    const oct = parseInt(m[2], 10);
    return (oct + 1) * 12 + idx;
  }

  function midiToNote(midi) {
    const clamped = Math.max(24, Math.min(96, Math.round(midi)));
    const name = NOTE_NAMES[clamped % 12];
    const oct = Math.floor(clamped / 12) - 1;
    return name + oct;
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function noteToFreq(noteStr) {
    return midiToFreq(noteToMidi(noteStr));
  }

  function getScaleNotes(key = 'A', scaleId = 'pentatonic-minor', minOct = 2, maxOct = 5) {
    const root = Math.max(0, NOTE_NAMES.indexOf(key));
    const scale = SCALES[scaleId] || SCALES['pentatonic-minor'];
    const notes = [];
    for (let oct = minOct; oct <= maxOct; oct++) {
      for (const iv of scale.intervals) {
        const midi = (oct + 1) * 12 + root + iv;
        if (midi >= (minOct + 1) * 12 && midi <= (maxOct + 2) * 12) {
          notes.push(midiToNote(midi));
        }
      }
    }
    return [...new Set(notes)].sort((a, b) => noteToMidi(a) - noteToMidi(b));
  }

  /**
   * Maps normalized string length (0.08..0.85) to a harmonious pitch in scale.
   * Longer string = deeper pitch, shorter string = higher pitch.
   */
  function lengthToNote(normLength, instrumentId, key = 'A', scaleId = 'pentatonic-minor') {
    const inst = INSTRUMENTS[instrumentId] || INSTRUMENTS.guitar;
    if (inst.kind === 'chord') {
      const list = inst.voices;
      const t = Math.max(0, Math.min(1, (normLength - 0.1) / 0.55));
      const idx = Math.min(list.length - 1, Math.floor((1 - t) * list.length));
      return list[idx];
    }
    if (inst.kind === 'percussion') {
      const list = inst.voices;
      const t = Math.max(0, Math.min(1, (normLength - 0.08) / 0.45));
      const idx = Math.min(list.length - 1, Math.floor(t * list.length));
      return list[idx].id;
    }
    const [minOct, maxOct] = inst.defaultOctaves || [2, 4];
    const scaleNotes = getScaleNotes(key, scaleId, minOct, maxOct);
    if (!scaleNotes.length) return 'A3';
    const clamped = Math.max(0.08, Math.min(0.68, normLength));
    const ratio = 1 - (clamped - 0.08) / 0.6; // shorter => closer to 1 (higher)
    const idx = Math.max(0, Math.min(scaleNotes.length - 1, Math.round(ratio * (scaleNotes.length - 1))));
    return scaleNotes[idx];
  }

  function getDisplayLabel(instrumentId, noteOrVoice) {
    const inst = INSTRUMENTS[instrumentId];
    if (!inst) return String(noteOrVoice || '');
    if (inst.kind === 'percussion') {
      const found = inst.voices.find((v) => v.id === noteOrVoice);
      return found ? found.short : String(noteOrVoice || '').toUpperCase();
    }
    return String(noteOrVoice || 'A3');
  }

  // ── Backing Grooves (16-step patterns per 1 bar) ──────────────────────────
  const BACKING_GROOVES = {
    off: { label: 'Off', steps: {} },
    lofi: {
      label: 'Lo-Fi Chill',
      steps: {
        kick: [0, 7, 10],
        snare: [4, 12],
        'hihat-closed': [0, 2, 4, 6, 8, 10, 12, 14],
        'hihat-open': [14],
      },
    },
    boombap: {
      label: 'Boom Bap',
      steps: {
        kick: [0, 2, 7, 10],
        snare: [4, 12],
        'hihat-closed': [0, 2, 4, 6, 8, 10, 12, 14],
        clap: [12],
      },
    },
    house: {
      label: 'House 4x4',
      steps: {
        kick: [0, 4, 8, 12],
        clap: [4, 12],
        'hihat-open': [2, 6, 10, 14],
        'hihat-closed': [0, 3, 4, 7, 8, 11, 12, 15],
      },
    },
    afro: {
      label: 'Afro Bongo',
      steps: {
        kick: [0, 6, 10],
        'bongo-hi': [0, 3, 6, 9, 12, 14],
        'bongo-lo': [2, 8, 11, 15],
        clave: [0, 3, 6, 10, 12],
        'hihat-closed': [0, 2, 4, 6, 8, 10, 12, 14],
      },
    },
    trap: {
      label: 'Trap 808',
      steps: {
        kick: [0, 6, 10],
        snare: [8],
        clap: [8],
        'hihat-closed': [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 15],
        'hihat-open': [14],
      },
    },
  };

  // ── Audio Engine Class ────────────────────────────────────────────────────
  class AirStringsAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.compressor = null;
      this.dryGain = null;
      this.reverbNode = null;
      this.reverbWet = null;
      this.delayL = null;
      this.delayR = null;
      this.delayFeedback = null;
      this.delayWet = null;
      this.noiseBuffer = null;

      this.volume = 0.85;
      this.reverbAmount = 0.24;
      this.echoAmount = 0.1;
      this.bpm = 110;

      // WAV recording state
      this.isRecordingWav = false;
      this._recNode = null;
      this._recLeft = [];
      this._recRight = [];
      this._recLength = 0;
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        this.ctx = new AudioCtx({ latencyHint: 'interactive' });

        // Master dynamics chain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;

        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.value = -10;
        this.compressor.knee.value = 18;
        this.compressor.ratio.value = 4;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.16;

        // Dry path
        this.dryGain = this.ctx.createGain();
        this.dryGain.gain.value = 1.0;

        // Stereo Reverb
        this.reverbNode = this.ctx.createConvolver();
        this.reverbNode.buffer = this._createReverbImpulse(1.8, 2.8);
        this.reverbWet = this.ctx.createGain();
        this.reverbWet.gain.value = this.reverbAmount;

        // Tempo-synced Stereo Delay / Echo
        this.delayL = this.ctx.createDelay(2.0);
        this.delayR = this.ctx.createDelay(2.0);
        this.delayFilter = this.ctx.createBiquadFilter();
        this.delayFilter.type = 'lowpass';
        this.delayFilter.frequency.value = 3200;
        this.delayFeedback = this.ctx.createGain();
        this.delayFeedback.gain.value = 0.34;
        this.delayWet = this.ctx.createGain();
        this.delayWet.gain.value = this.echoAmount;

        const merger = this.ctx.createChannelMerger(2);
        this.delayL.connect(this.delayFilter);
        this.delayFilter.connect(this.delayFeedback);
        this.delayFeedback.connect(this.delayR);
        this.delayR.connect(this.delayL);
        this.delayL.connect(merger, 0, 0);
        this.delayR.connect(merger, 0, 1);
        merger.connect(this.delayWet);

        // Route into master bus
        this.dryGain.connect(this.compressor);
        this.reverbNode.connect(this.reverbWet);
        this.reverbWet.connect(this.compressor);
        this.delayWet.connect(this.compressor);

        this.compressor.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);

        this.noiseBuffer = this._createNoiseBuffer(1.5);
        this.setBpm(this.bpm);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    _createNoiseBuffer(durationSec) {
      const sr = this.ctx.sampleRate;
      const len = Math.floor(sr * durationSec);
      const buf = this.ctx.createBuffer(1, len, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buf;
    }

    _createReverbImpulse(seconds, decay) {
      const sr = this.ctx.sampleRate;
      const len = Math.floor(sr * seconds);
      const impulse = this.ctx.createBuffer(2, len, sr);
      for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          const env = Math.pow(1 - i / len, decay);
          data[i] = (Math.random() * 2 - 1) * env * 0.6;
        }
      }
      return impulse;
    }

    setVolume(val) {
      this.volume = Math.max(0, Math.min(1.2, val));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
      }
    }

    setReverb(val) {
      this.reverbAmount = Math.max(0, Math.min(0.85, val));
      if (this.reverbWet && this.ctx) {
        this.reverbWet.gain.setTargetAtTime(this.reverbAmount, this.ctx.currentTime, 0.03);
      }
    }

    setEcho(val) {
      this.echoAmount = Math.max(0, Math.min(0.65, val));
      if (this.delayWet && this.ctx) {
        this.delayWet.gain.setTargetAtTime(this.echoAmount, this.ctx.currentTime, 0.03);
      }
    }

    setBpm(bpm) {
      this.bpm = Math.max(50, Math.min(200, bpm));
      if (this.ctx && this.delayL && this.delayR) {
        const beat = 60 / this.bpm;
        this.delayL.delayTime.setTargetAtTime(Math.min(1.8, beat * 0.75), this.ctx.currentTime, 0.05);
        this.delayR.delayTime.setTargetAtTime(Math.min(1.8, beat * 0.5), this.ctx.currentTime, 0.05);
      }
    }

    _connectVoice(node, { sendReverb = 0.3, sendDelay = 0.15 } = {}) {
      node.connect(this.dryGain);
      if (sendReverb > 0 && this.reverbNode) {
        const rg = this.ctx.createGain();
        rg.gain.value = sendReverb;
        node.connect(rg);
        rg.connect(this.reverbNode);
      }
      if (sendDelay > 0 && this.delayL) {
        const dg = this.ctx.createGain();
        dg.gain.value = sendDelay;
        node.connect(dg);
        dg.connect(this.delayL);
      }
    }

    // ── Unified Trigger Entry Point ─────────────────────────────────────────
    trigger(instrumentId, noteOrVoice, velocity = 0.8, pluckPos = 0.5, when = null) {
      const ctx = this.ensureContext();
      const t = when != null ? Math.max(ctx.currentTime, when) : ctx.currentTime;
      const vel = Math.max(0.18, Math.min(1.0, velocity));

      switch (instrumentId) {
        case 'guitar':
          this._playGuitar(noteToFreq(noteOrVoice), vel, pluckPos, t);
          break;
        case 'piano':
          this._playPiano(noteToFreq(noteOrVoice), vel, t);
          break;
        case 'harp':
          this._playHarp(noteToFreq(noteOrVoice), vel, pluckPos, t);
          break;
        case 'synth':
          this._playSynth(noteToFreq(noteOrVoice), vel, pluckPos, t);
          break;
        case 'bass':
          this._playBass(noteToFreq(noteOrVoice), vel, t);
          break;
        case 'chords':
          this._playChord(noteOrVoice, vel, t);
          break;
        case 'drums':
          this._playDrum(noteOrVoice, vel, t);
          break;
        case 'bongos':
          this._playBongo(noteOrVoice, vel, t);
          break;
        default:
          this._playGuitar(noteToFreq(noteOrVoice || 'A3'), vel, pluckPos, t);
      }
    }

    playMetronome(isAccent, when = null) {
      const ctx = this.ensureContext();
      const t = when != null ? Math.max(ctx.currentTime, when) : ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isAccent ? 1480 : 980, t);
      osc.frequency.exponentialRampToValueAtTime(isAccent ? 920 : 620, t + 0.03);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(isAccent ? 0.22 : 0.13, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      osc.connect(g);
      g.connect(this.dryGain);
      osc.start(t);
      osc.stop(t + 0.055);
    }

    // ── 1. Karplus-Strong Plucked Guitar ────────────────────────────────────
    _playGuitar(freq, vel, pluckPos, t) {
      const ctx = this.ctx;
      const sr = ctx.sampleRate;
      const duration = Math.min(2.6, Math.max(1.3, 420 / freq));
      const totalSamples = Math.floor(sr * duration);
      const period = Math.max(2, Math.round(sr / freq));

      const buf = ctx.createBuffer(1, totalSamples, sr);
      const out = buf.getChannelData(0);

      // Pluck position comb: near center = warm mellow, near edges = bright twang
      const edgeFactor = Math.abs(pluckPos - 0.5) * 2; // 0 center .. 1 edge
      const pickComb = Math.max(2, Math.round(period * (0.12 + 0.36 * (1 - edgeFactor))));
      const damping = 0.9945 - (freq > 400 ? 0.0025 : 0);

      // Seed initial excitation burst with smoothed pink-ish noise
      const noise = new Float32Array(period);
      let last = 0;
      for (let i = 0; i < period; i++) {
        const raw = Math.random() * 2 - 1;
        // Blend white and smoothed noise based on velocity + pluck brightness
        const bright = 0.45 + 0.45 * edgeFactor + 0.1 * vel;
        last = last * (1 - bright) + raw * bright;
        noise[i] = last;
      }
      // Apply pick-position comb notch for authentic string timbre
      for (let i = 0; i < period; i++) {
        const j = (i - pickComb + period) % period;
        out[i] = (noise[i] - 0.52 * noise[j]) * (0.8 + 0.25 * vel);
      }

      // Karplus-Strong recursive lowpass string loop
      for (let i = period; i < totalSamples; i++) {
        out[i] = damping * 0.5 * (out[i - period] + out[i - period + 1]);
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;

      // Subtle guitar body resonance EQ
      const body = ctx.createBiquadFilter();
      body.type = 'peaking';
      body.frequency.value = 215;
      body.Q.value = 1.6;
      body.gain.value = 3.5;

      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.setValueAtTime(1800 + vel * 3800 + edgeFactor * 1600, t);
      tone.frequency.exponentialRampToValueAtTime(1100, t + duration * 0.75);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.55 * vel, t + 0.003);
      gain.gain.setValueAtTime(0.55 * vel, t + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + duration);

      src.connect(body);
      body.connect(tone);
      tone.connect(gain);
      this._connectVoice(gain, { sendReverb: 0.34, sendDelay: 0.22 });

      src.start(t);
      src.stop(t + duration + 0.05);
    }

    // ── 2. Warm Grand / Electric Piano ──────────────────────────────────────
    _playPiano(freq, vel, t) {
      const ctx = this.ctx;
      const decay = Math.min(2.4, Math.max(0.95, 580 / freq));
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.linearRampToValueAtTime(0.36 * vel, t + 0.006);
      out.gain.exponentialRampToValueAtTime(0.14 * vel, t + 0.22);
      out.gain.exponentialRampToValueAtTime(0.0005, t + decay);

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(Math.min(9500, freq * (4 + vel * 7)), t);
      lpf.frequency.exponentialRampToValueAtTime(Math.max(420, freq * 1.9), t + decay * 0.8);

      const partials = [
        { mult: 1, type: 'triangle', amp: 0.65, detune: 0 },
        { mult: 2, type: 'sine', amp: 0.28, detune: 1.8 },
        { mult: 3, type: 'sine', amp: 0.12 * vel, detune: -1.5 },
        { mult: 4, type: 'sine', amp: 0.06 * vel, detune: 2.6 },
      ];

      partials.forEach((p) => {
        const osc = ctx.createOscillator();
        const pg = ctx.createGain();
        osc.type = p.type;
        osc.frequency.setValueAtTime(freq * p.mult, t);
        osc.detune.value = p.detune;
        pg.gain.value = p.amp;
        osc.connect(pg);
        pg.connect(lpf);
        osc.start(t);
        osc.stop(t + decay + 0.06);
      });

      // Soft felt hammer strike transient
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const nbp = ctx.createBiquadFilter();
      nbp.type = 'bandpass';
      nbp.frequency.value = Math.min(4500, freq * 3.5);
      nbp.Q.value = 2.0;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.09 * vel, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      noise.connect(nbp);
      nbp.connect(ng);
      ng.connect(out);
      noise.start(t);
      noise.stop(t + 0.035);

      lpf.connect(out);
      this._connectVoice(out, { sendReverb: 0.42, sendDelay: 0.16 });
    }

    // ── 3. Crystalline Laser Harp / Kalimba ─────────────────────────────────
    _playHarp(freq, vel, pluckPos, t) {
      const ctx = this.ctx;
      const dur = 2.1;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.linearRampToValueAtTime(0.34 * vel, t + 0.004);
      out.gain.exponentialRampToValueAtTime(0.0005, t + dur);

      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, t);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, t);
      osc2.detune.value = (pluckPos - 0.5) * 14;

      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.24 * vel, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      const bell = ctx.createOscillator();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(freq * 3, t);
      const gb = ctx.createGain();
      gb.gain.setValueAtTime(0.11 * vel, t);
      gb.gain.exponentialRampToValueAtTime(0.0005, t + 0.2);

      osc1.connect(out);
      osc2.connect(g2);
      g2.connect(out);
      bell.connect(gb);
      gb.connect(out);

      this._connectVoice(out, { sendReverb: 0.55, sendDelay: 0.36 });

      [osc1, osc2, bell].forEach((o) => {
        o.start(t);
        o.stop(t + dur + 0.05);
      });
    }

    // ── 4. Cyberpunk Neon Synth Pluck ───────────────────────────────────────
    _playSynth(freq, vel, pluckPos, t) {
      const ctx = this.ctx;
      const dur = 0.85;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.linearRampToValueAtTime(0.28 * vel, t + 0.005);
      out.gain.exponentialRampToValueAtTime(0.0008, t + dur);

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.Q.value = 3.2 + pluckPos * 3.5;
      lpf.frequency.setValueAtTime(Math.min(9000, freq * (5 + vel * 9)), t);
      lpf.frequency.exponentialRampToValueAtTime(Math.max(260, freq * 1.4), t + 0.34);

      const s1 = ctx.createOscillator();
      const s2 = ctx.createOscillator();
      const sub = ctx.createOscillator();
      s1.type = 'sawtooth';
      s2.type = 'sawtooth';
      sub.type = 'triangle';
      s1.frequency.setValueAtTime(freq, t);
      s2.frequency.setValueAtTime(freq, t);
      sub.frequency.setValueAtTime(freq * 0.5, t);
      s1.detune.value = -9;
      s2.detune.value = 9;

      const subG = ctx.createGain();
      subG.gain.value = 0.35;

      s1.connect(lpf);
      s2.connect(lpf);
      sub.connect(subG);
      subG.connect(lpf);
      lpf.connect(out);

      this._connectVoice(out, { sendReverb: 0.38, sendDelay: 0.32 });

      [s1, s2, sub].forEach((o) => {
        o.start(t);
        o.stop(t + dur + 0.05);
      });
    }

    // ── 5. Deep 808 / Moog Sub Bass ─────────────────────────────────────────
    _playBass(freq, vel, t) {
      const ctx = this.ctx;
      const f = freq > 180 ? freq * 0.5 : freq;
      const dur = 0.72;

      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.linearRampToValueAtTime(0.55 * vel, t + 0.006);
      out.gain.exponentialRampToValueAtTime(0.28 * vel, t + 0.14);
      out.gain.exponentialRampToValueAtTime(0.0008, t + dur);

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.Q.value = 2.6;
      lpf.frequency.setValueAtTime(f * (5.5 + vel * 4), t);
      lpf.frequency.exponentialRampToValueAtTime(Math.max(120, f * 1.8), t + 0.24);

      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(f * 1.15, t);
      sub.frequency.exponentialRampToValueAtTime(f, t + 0.025);

      const saw = ctx.createOscillator();
      saw.type = 'sawtooth';
      saw.frequency.setValueAtTime(f, t);
      const sawG = ctx.createGain();
      sawG.gain.value = 0.32;

      sub.connect(out);
      saw.connect(sawG);
      sawG.connect(lpf);
      lpf.connect(out);

      this._connectVoice(out, { sendReverb: 0.06, sendDelay: 0.0 });

      sub.start(t);
      saw.start(t);
      sub.stop(t + dur + 0.05);
      saw.stop(t + dur + 0.05);
    }

    // ── 6. Lo-Fi Strummed Chord Pad ─────────────────────────────────────────
    _playChord(chordName, vel, t) {
      const notes = CHORD_VOICINGS[chordName] || CHORD_VOICINGS.Am7;
      notes.forEach((n, idx) => {
        const offset = idx * 0.016;
        this._playPiano(noteToFreq(n), vel * (idx === 0 ? 0.62 : 0.48), t + offset);
      });
    }

    // ── 7. Studio / 808 Drum Kit ────────────────────────────────────────────
    _playDrum(voice, vel, t) {
      const ctx = this.ctx;

      if (voice === 'kick') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(48, t + 0.065);
        osc.frequency.exponentialRampToValueAtTime(36, t + 0.34);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.92 * vel, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

        // Beater punch click
        const click = ctx.createOscillator();
        const cg = ctx.createGain();
        click.type = 'triangle';
        click.frequency.setValueAtTime(1100, t);
        click.frequency.exponentialRampToValueAtTime(120, t + 0.018);
        cg.gain.setValueAtTime(0.28 * vel, t);
        cg.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        osc.connect(g);
        click.connect(cg);
        cg.connect(g);
        this._connectVoice(g, { sendReverb: 0.05, sendDelay: 0 });
        osc.start(t);
        click.start(t);
        osc.stop(t + 0.42);
        click.stop(t + 0.03);
        return;
      }

      if (voice === 'snare') {
        // Snare wire noise
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const hpf = ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 1100;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.55 * vel, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.19);
        noise.connect(hpf);
        hpf.connect(ng);
        this._connectVoice(ng, { sendReverb: 0.25, sendDelay: 0.04 });
        noise.start(t);
        noise.stop(t + 0.22);

        // Woody shell body
        const body = ctx.createOscillator();
        const bg = ctx.createGain();
        body.type = 'triangle';
        body.frequency.setValueAtTime(220, t);
        body.frequency.exponentialRampToValueAtTime(135, t + 0.07);
        bg.gain.setValueAtTime(0.45 * vel, t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        body.connect(bg);
        this._connectVoice(bg, { sendReverb: 0.15, sendDelay: 0 });
        body.start(t);
        body.stop(t + 0.13);
        return;
      }

      if (voice === 'hihat-closed' || voice === 'hihat-open' || voice === 'crash') {
        const isCrash = voice === 'crash';
        const isOpen = voice === 'hihat-open';
        const dur = isCrash ? 1.05 : isOpen ? 0.34 : 0.055;

        const out = ctx.createGain();
        out.gain.setValueAtTime(0.001, t);
        out.gain.linearRampToValueAtTime((isCrash ? 0.3 : 0.26) * vel, t + 0.002);
        out.gain.exponentialRampToValueAtTime(0.0008, t + dur);

        const hpf = ctx.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = isCrash ? 4800 : 7200;

        // TR-808 style metallic square cluster + crisp noise shimmer
        const ratios = [263, 400, 421, 474, 587, 845];
        ratios.forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = 'square';
          osc.frequency.value = f * (isCrash ? 1.12 : 1.35);
          const og = ctx.createGain();
          og.gain.value = 0.16;
          osc.connect(og);
          og.connect(hpf);
          osc.start(t);
          osc.stop(t + dur + 0.03);
        });

        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const ng = ctx.createGain();
        ng.gain.value = isCrash ? 0.55 : 0.35;
        noise.connect(ng);
        ng.connect(hpf);
        noise.start(t);
        noise.stop(t + dur + 0.03);

        hpf.connect(out);
        this._connectVoice(out, { sendReverb: isCrash ? 0.45 : 0.12, sendDelay: 0 });
        return;
      }

      if (voice === 'clap') {
        const bursts = [0, 0.011, 0.022, 0.034];
        bursts.forEach((offset, idx) => {
          const noise = ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.value = 1350;
          bp.Q.value = 1.4;
          const g = ctx.createGain();
          const tail = idx === bursts.length - 1 ? 0.21 : 0.024;
          g.gain.setValueAtTime(0.46 * vel, t + offset);
          g.gain.exponentialRampToValueAtTime(0.001, t + offset + tail);
          noise.connect(bp);
          bp.connect(g);
          this._connectVoice(g, { sendReverb: 0.35, sendDelay: 0.08 });
          noise.start(t + offset);
          noise.stop(t + offset + tail + 0.02);
        });
        return;
      }

      if (voice === 'tom-hi' || voice === 'tom-low') {
        const startF = voice === 'tom-hi' ? 210 : 132;
        const endF = voice === 'tom-hi' ? 118 : 66;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(startF, t);
        osc.frequency.exponentialRampToValueAtTime(endF, t + 0.14);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.64 * vel, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(g);
        this._connectVoice(g, { sendReverb: 0.22, sendDelay: 0 });
        osc.start(t);
        osc.stop(t + 0.32);
        return;
      }
    }

    // ── 8. Bongos & Latin Percussion ────────────────────────────────────────
    _playBongo(voice, vel, t) {
      const ctx = this.ctx;

      if (voice === 'bongo-hi' || voice === 'bongo-lo' || voice === 'conga-open' || voice === 'conga-slap') {
        const cfg = {
          'bongo-hi': { f0: 540, f1: 375, dur: 0.16, slap: 0.22, tone: 0.56 },
          'bongo-lo': { f0: 365, f1: 248, dur: 0.22, slap: 0.18, tone: 0.62 },
          'conga-open': { f0: 265, f1: 182, dur: 0.3, slap: 0.15, tone: 0.66 },
          'conga-slap': { f0: 410, f1: 295, dur: 0.11, slap: 0.42, tone: 0.38 },
        }[voice];

        // Resonant hand-drum membrane
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const bp = ctx.createBiquadFilter();
        bp.type = 'peaking';
        bp.frequency.value = cfg.f1 * 1.45;
        bp.Q.value = 2.4;
        bp.gain.value = 4.5;

        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(cfg.f0, t);
        osc.frequency.exponentialRampToValueAtTime(cfg.f1, t + 0.032);
        osc.frequency.exponentialRampToValueAtTime(cfg.f1 * 0.94, t + cfg.dur);

        // Woody overtone
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(cfg.f0 * 1.52, t);
        osc2.frequency.exponentialRampToValueAtTime(cfg.f1 * 1.48, t + 0.025);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.22 * vel, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(cfg.tone * vel, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, t + cfg.dur);

        osc.connect(bp);
        osc2.connect(g2);
        g2.connect(bp);
        bp.connect(g);
        this._connectVoice(g, { sendReverb: 0.28, sendDelay: 0.08 });

        // Palm slap transient
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const nbp = ctx.createBiquadFilter();
        nbp.type = 'bandpass';
        nbp.frequency.value = voice === 'conga-slap' ? 1900 : 1250;
        nbp.Q.value = 1.8;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(cfg.slap * vel, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.028);
        noise.connect(nbp);
        nbp.connect(ng);
        this._connectVoice(ng, { sendReverb: 0.2, sendDelay: 0 });

        osc.start(t);
        osc2.start(t);
        noise.start(t);
        osc.stop(t + cfg.dur + 0.04);
        osc2.stop(t + 0.07);
        noise.stop(t + 0.04);
        return;
      }

      if (voice === 'cowbell') {
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        o1.type = 'square';
        o2.type = 'square';
        o1.frequency.value = 545;
        o2.frequency.value = 815;

        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 720;
        bp.Q.value = 2.6;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.42 * vel, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.08 * vel, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.34);

        o1.connect(bp);
        o2.connect(bp);
        bp.connect(g);
        this._connectVoice(g, { sendReverb: 0.24, sendDelay: 0.06 });
        o1.start(t);
        o2.start(t);
        o1.stop(t + 0.38);
        o2.stop(t + 0.38);
        return;
      }

      if (voice === 'clave') {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2520, t);
        osc.frequency.exponentialRampToValueAtTime(2440, t + 0.03);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.4 * vel, t + 0.0015);
        g.gain.exponentialRampToValueAtTime(0.0008, t + 0.045);
        osc.connect(g);
        this._connectVoice(g, { sendReverb: 0.32, sendDelay: 0.14 });
        osc.start(t);
        osc.stop(t + 0.06);
      }
    }

    // ── Live WAV Recording (16-bit Stereo PCM) ──────────────────────────────
    startWavRecording() {
      const ctx = this.ensureContext();
      if (this.isRecordingWav) return;
      this._recLeft = [];
      this._recRight = [];
      this._recLength = 0;

      // ScriptProcessor works reliably across all browsers without external Worklet files
      const bufSize = 4096;
      const proc = ctx.createScriptProcessor(bufSize, 2, 2);
      proc.onaudioprocess = (ev) => {
        if (!this.isRecordingWav) return;
        const chL = new Float32Array(ev.inputBuffer.getChannelData(0));
        const chR = new Float32Array(ev.inputBuffer.getChannelData(1));
        this._recLeft.push(chL);
        this._recRight.push(chR);
        this._recLength += chL.length;
      };

      const silentSink = ctx.createGain();
      silentSink.gain.value = 0;
      this.masterGain.connect(proc);
      proc.connect(silentSink);
      silentSink.connect(ctx.destination);

      this._recNode = proc;
      this._recSink = silentSink;
      this.isRecordingWav = true;
    }

    stopWavRecording() {
      if (!this.isRecordingWav) return null;
      this.isRecordingWav = false;

      try {
        if (this._recNode) {
          this.masterGain.disconnect(this._recNode);
          this._recNode.disconnect();
        }
        if (this._recSink) {
          this._recSink.disconnect();
        }
      } catch (_) {}

      const sampleRate = this.ctx ? this.ctx.sampleRate : 44100;
      const length = this._recLength;
      if (!length) return null;

      const left = this._mergeBuffers(this._recLeft, length);
      const right = this._mergeBuffers(this._recRight, length);
      this._recLeft = [];
      this._recRight = [];
      this._recLength = 0;

      return this._encodeWav(left, right, sampleRate);
    }

    _mergeBuffers(chunks, totalLength) {
      const result = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      return result;
    }

    _encodeWav(left, right, sampleRate) {
      const numSamples = left.length;
      const buffer = new ArrayBuffer(44 + numSamples * 4);
      const view = new DataView(buffer);

      const writeStr = (off, str) => {
        for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
      };

      writeStr(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 4, true);
      writeStr(8, 'WAVE');
      writeStr(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 2, true); // Stereo
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 4, true);
      view.setUint16(32, 4, true);
      view.setUint16(34, 16, true);
      writeStr(36, 'data');
      view.setUint32(40, numSamples * 4, true);

      let offset = 44;
      for (let i = 0; i < numSamples; i++) {
        const sL = Math.max(-1, Math.min(1, left[i]));
        const sR = Math.max(-1, Math.min(1, right[i]));
        view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
        view.setInt16(offset + 2, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
        offset += 4;
      }

      return new Blob([buffer], { type: 'audio/wav' });
    }
  }

  global.AirStringsAudio = {
    NOTE_NAMES,
    SCALES,
    CHORD_VOICINGS,
    DRUM_VOICES,
    BONGO_VOICES,
    INSTRUMENTS,
    BACKING_GROOVES,
    noteToMidi,
    midiToNote,
    midiToFreq,
    noteToFreq,
    getScaleNotes,
    lengthToNote,
    getDisplayLabel,
    Engine: AirStringsAudioEngine,
  };
})(window);
