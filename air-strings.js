/**
 * Air Strings — Webcam Hand-Tracking Laser Instrument & Beat Studio
 * Uses MediaPipe Hand Landmarker (on-device CV, zero server upload) +
 * AirStringsAudio Web Audio synthesis engine.
 */
(function () {
  'use strict';

  const AudioLib = window.AirStringsAudio;
  if (!AudioLib) return;

  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17],
  ];

  const ALL_FINGERTIPS = [4, 8, 12, 16, 20];
  const INDEX_ONLY = [8];

  const STORAGE_KEY = 'johnb_air_strings_rig_v1';

  const NEON_COLORS = [
    '#00eefc',
    '#ff007f',
    '#a3ff12',
    '#fbbf24',
    '#c084fc',
    '#34d399',
    '#38bdf8',
    '#fb7185',
  ];

  let nextIdCounter = 1;
  function makeId() {
    return 'el_' + (nextIdCounter++);
  }

  function createString(x1, y1, x2, y2, instrument, note, color) {
    const inst = AudioLib.INSTRUMENTS[instrument] || AudioLib.INSTRUMENTS.guitar;
    return {
      id: makeId(),
      shape: 'string',
      x1, y1, x2, y2,
      instrument,
      note,
      color: color || inst.color,
      vibAmp: 0,
      vibPhase: 0,
      pluckT: 0.5,
      flash: 0,
      lastHitNote: note,
    };
  }

  function createPad(cx, cy, r, instrument, note, color) {
    const inst = AudioLib.INSTRUMENTS[instrument] || AudioLib.INSTRUMENTS.bongos;
    return {
      id: makeId(),
      shape: 'pad',
      cx, cy, r,
      instrument,
      note,
      color: color || inst.color,
      vibAmp: 0,
      flash: 0,
      lastHitNote: note,
    };
  }

  // ── Curated Studio Presets ────────────────────────────────────────────────
  function buildPreset(presetId) {
    if (presetId === 'beat-studio') {
      // Inspired directly by the criss-crossing neon strings layout + drums & bongos
      return [
        createString(0.14, 0.20, 0.78, 0.34, 'guitar', 'E3', '#00eefc'),
        createString(0.08, 0.36, 0.80, 0.44, 'guitar', 'G3', '#34d399'),
        createString(0.05, 0.66, 0.84, 0.18, 'piano', 'A4', '#ff3da6'),
        createString(0.16, 0.14, 0.82, 0.28, 'synth', 'C4', '#38bdf8'),
        createString(0.42, 0.56, 0.72, 0.72, 'drums', 'snare', '#fbbf24'),
        createString(0.40, 0.75, 0.77, 0.84, 'drums', 'kick', '#ff7b00'),
        createString(0.50, 0.89, 0.82, 0.78, 'drums', 'hihat-closed', '#facc15'),
        createString(0.10, 0.90, 0.66, 0.87, 'bass', 'A2', '#c084fc'),
        createPad(0.14, 0.74, 0.068, 'bongos', 'bongo-hi', '#a3ff12'),
        createPad(0.28, 0.77, 0.072, 'bongos', 'bongo-lo', '#4ade80'),
      ];
    }

    if (presetId === 'air-guitar') {
      const notes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
      const colors = ['#c084fc', '#38bdf8', '#00eefc', '#34d399', '#a3ff12', '#ff3da6'];
      return notes.map((n, i) => {
        const yL = 0.26 + i * 0.095;
        const yR = 0.16 + i * 0.105;
        return createString(0.12, yL, 0.88, yR, 'guitar', n, colors[i]);
      });
    }

    if (presetId === 'laser-harp') {
      const notes = ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5'];
      return notes.map((n, i) => {
        const xTop = 0.14 + i * 0.102;
        const xBot = 0.09 + i * 0.116;
        const inst = i % 2 === 0 ? 'harp' : 'piano';
        const col = i % 2 === 0 ? '#00eefc' : '#ff3da6';
        return createString(xTop, 0.12, xBot, 0.88, inst, n, col);
      });
    }

    if (presetId === 'bongo-kit') {
      return [
        createString(0.08, 0.20, 0.36, 0.26, 'drums', 'crash', '#fbbf24'),
        createString(0.64, 0.26, 0.92, 0.20, 'drums', 'hihat-open', '#facc15'),
        createString(0.38, 0.16, 0.62, 0.16, 'bongos', 'cowbell', '#a3ff12'),
        createPad(0.18, 0.56, 0.082, 'drums', 'hihat-closed', '#facc15'),
        createPad(0.36, 0.62, 0.085, 'drums', 'snare', '#ff007f'),
        createPad(0.50, 0.78, 0.092, 'drums', 'kick', '#00eefc'),
        createPad(0.66, 0.62, 0.082, 'bongos', 'bongo-hi', '#a3ff12'),
        createPad(0.82, 0.56, 0.086, 'bongos', 'bongo-lo', '#34d399'),
        createPad(0.24, 0.82, 0.072, 'drums', 'clap', '#c084fc'),
        createPad(0.76, 0.82, 0.072, 'bongos', 'conga-open', '#38bdf8'),
      ];
    }

    if (presetId === 'lofi-jam') {
      return [
        createString(0.08, 0.22, 0.42, 0.28, 'chords', 'Am7', '#f472b6'),
        createString(0.08, 0.38, 0.42, 0.44, 'chords', 'Fmaj7', '#c084fc'),
        createString(0.08, 0.54, 0.42, 0.60, 'chords', 'Cmaj7', '#38bdf8'),
        createString(0.08, 0.70, 0.42, 0.76, 'chords', 'G6', '#00eefc'),
        createString(0.58, 0.20, 0.92, 0.26, 'piano', 'A4', '#ff3da6'),
        createString(0.58, 0.35, 0.92, 0.41, 'piano', 'C5', '#00eefc'),
        createString(0.58, 0.50, 0.92, 0.56, 'piano', 'D5', '#34d399'),
        createString(0.58, 0.65, 0.92, 0.71, 'piano', 'E5', '#a3ff12'),
        createPad(0.32, 0.86, 0.068, 'drums', 'kick', '#fbbf24'),
        createPad(0.50, 0.86, 0.068, 'drums', 'snare', '#ff007f'),
        createPad(0.68, 0.86, 0.068, 'drums', 'hihat-closed', '#00eefc'),
      ];
    }

    return [];
  }

  // ── Geometry Helpers ──────────────────────────────────────────────────────
  function ccw(A, B, C) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }

  function segmentsIntersect(p1, p2, a, b) {
    if (ccw(p1, a, b) === ccw(p2, a, b) || ccw(p1, p2, a) === ccw(p1, p2, b)) {
      return null;
    }
    const rX = p2.x - p1.x;
    const rY = p2.y - p1.y;
    const sX = b.x - a.x;
    const sY = b.y - a.y;
    const denom = rX * sY - rY * sX;
    if (Math.abs(denom) < 1e-8) return null;
    const u = ((a.x - p1.x) * rY - (a.y - p1.y) * rX) / denom;
    const t = Math.max(0.05, Math.min(0.95, u));
    return {
      t,
      x: a.x + t * sX,
      y: a.y + t * sY,
    };
  }

  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-8) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  // ── Main Studio Controller ────────────────────────────────────────────────
  class AirStringsApp {
    constructor() {
      this.audio = new AudioLib.Engine();

      // DOM refs
      this.stage = document.getElementById('as-stage');
      this.video = document.getElementById('as-video');
      this.canvas = document.getElementById('as-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.statusText = document.getElementById('as-status-text');
      this.statusDot = document.getElementById('as-status-dot');
      this.camBtn = document.getElementById('as-cam-btn');
      this.flipCamBtn = document.getElementById('as-flip-cam-btn');
      this.camOverlay = document.getElementById('as-cam-overlay');
      this.overlayStartBtn = document.getElementById('as-overlay-start');
      this.overlayDemoBtn = document.getElementById('as-overlay-demo');
      this.fullscreenBtn = document.getElementById('as-fullscreen-btn');
      this.rackList = document.getElementById('as-rack-list');
      this.rackCount = document.getElementById('as-rack-count');
      this.toastEl = document.getElementById('as-toast');

      // State
      this.items = buildPreset('beat-studio');
      this.selectedId = null;
      this.mode = 'play'; // 'play' | 'draw' | 'edit'
      this.drawShape = 'string'; // 'string' | 'pad'
      this.drawInstrument = 'guitar';
      this.drawColor = 'auto';
      this.key = 'A';
      this.scale = 'pentatonic-minor';
      this.fretboardMode = false;
      this.handStyle = 'mono'; // 'mono' | 'classic' | 'cyber' | 'minimal'
      this.fingerMode = 'all'; // 'all' | 'index'
      this.bgMode = 'none'; // 'none' | 'blur-soft' | 'blur-heavy' | 'cyber-bg'
      this.showLabels = true;
      this.videoDimmer = 0.28;

      // Webcam & MediaPipe CV state
      this.isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || window.innerWidth < 820;
      this.facingMode = 'user';
      this.cameraActive = false;
      this.stream = null;
      this.visionMod = null;
      this.visionFileset = null;
      this.handLandmarker = null;
      this._handDelegate = 'GPU';
      this._handErrorCount = 0;
      this._switchingToCpu = false;
      this.imageSegmenter = null;
      this.loadingModel = false;
      this.loadingSegmenter = false;
      this.hasMask = false;
      this._maskCanvas = document.createElement('canvas');
      this._maskCtx = this._maskCanvas.getContext('2d');
      this._maskImgData = null;
      this._personCanvas = document.createElement('canvas');
      this._personCtx = this._personCanvas.getContext('2d');
      this._cvCanvas = document.createElement('canvas');
      this._cvCtx = this._cvCanvas.getContext('2d', { willReadFrequently: true });
      this._lastCvTs = 0;
      this._lastDetectWallMs = 0;
      this._lastReportedHands = -1;
      this.lastVideoTime = -1;
      this.activeTouches = new Map();
      this.latestHands = [];
      this.prevPointerMap = new Map(); // pointerId -> {x, y, time}
      this.cooldownMap = new Map(); // pointerId:itemId -> timestampMs
      this.insidePadSet = new Set(); // pointerId:itemId

      // Pinch-to-draw CV gesture state
      this.handPinch = [
        { active: false, x: 0, y: 0, startX: 0, startY: 0 },
        { active: false, x: 0, y: 0, startX: 0, startY: 0 },
      ];
      this.twoHandDraw = null;

      // Mouse / Touch interaction state
      this.mouseDraw = null; // { shape, x1, y1, x2, y2 }
      this.editDrag = null; // { id, part: 'a'|'b'|'body'|'center'|'radius', ox, oy }
      this.prevMouse = null;

      // Visual FX
      this.sparks = [];
      this.ripples = [];
      this.hitBanner = { text: '', color: '#00eefc', alpha: 0 };
      this.beatPulse = 0;

      // Sequencer / Looper / Backing Groove
      this.bpm = 110;
      this.loopBars = 2; // 2 bars (8 beats) or 4 bars (16 beats)
      this.metronomeOn = false;
      this.backingGroove = 'off';
      this.quantize = '1/16'; // 'off' | '1/8' | '1/16'
      this.transportRunning = false;
      this.loopState = 'idle'; // 'idle' | 'countin' | 'recording' | 'playing' | 'overdub'
      this.countInBeatsLeft = 0;
      this.loopEvents = []; // { beatOffset, itemId, instrument, note, velocity, pluckT, layerId }
      this.currentLayerId = 0;
      this.transportStartTime = 0;
      this.loopStartTime = 0;
      this.nextStepTime = 0;
      this.currentStep = 0;
      this.schedulerTimer = null;
      this.currentBeatInBar = 0;
      this.loopProgress = 0;

      // Tap tempo
      this._tapTimes = [];

      // Restore saved custom rig if user explicitly saved one? Default to beat-studio so first visit pops!
      this.bindUI();
      this.bindCanvasEvents();
      this.resizeCanvas();
      this.renderRack();
      this.updateLooperUI();
      this.startRenderLoop();
    }

    // ── Toast helper ────────────────────────────────────────────────────────
    showToast(msg) {
      if (!this.toastEl) return;
      this.toastEl.textContent = msg;
      this.toastEl.classList.add('show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toastEl.classList.remove('show');
      }, 2400);
    }

    setStatus(text, state = 'idle') {
      if (this.statusText) this.statusText.textContent = text;
      if (this.statusDot) {
        this.statusDot.className = 'as-status-dot as-status-dot--' + state;
      }
    }

    // ── UI Bindings ─────────────────────────────────────────────────────────
    bindUI() {
      // Camera toggle & flip camera
      const handleStartCam = () => this.toggleCamera();
      if (this.camBtn) this.camBtn.addEventListener('click', handleStartCam);
      if (this.overlayStartBtn) this.overlayStartBtn.addEventListener('click', handleStartCam);
      if (this.flipCamBtn) {
        this.flipCamBtn.addEventListener('click', () => this.flipCamera());
      }
      // Global first-gesture mobile audio unlock
      const unlockAudio = () => {
        try { this.audio.ensureContext(); } catch (_) {}
      };
      window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
      window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
      if (this.overlayDemoBtn) {
        this.overlayDemoBtn.addEventListener('click', () => {
          this.audio.ensureContext();
          if (this.camOverlay) this.camOverlay.classList.add('hidden');
          this.setStatus('Mouse / Touch Play Mode — swipe strings to play!', 'ready');
          this.showToast('Swipe your mouse or finger across the neon strings!');
        });
      }

      // Fullscreen / Theater toggle
      if (this.fullscreenBtn) {
        this.fullscreenBtn.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            if (this.stage.requestFullscreen) {
              this.stage.requestFullscreen().catch(() => {});
            }
          } else if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        });
      }

      document.addEventListener('fullscreenchange', () => {
        setTimeout(() => this.resizeCanvas(), 80);
      });

      // Mode buttons (Play / Draw / Edit)
      document.querySelectorAll('[data-mode]').forEach((btn) => {
        btn.addEventListener('click', () => this.setMode(btn.dataset.mode));
      });

      // Shape buttons (String / Pad)
      document.querySelectorAll('[data-shape]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.drawShape = btn.dataset.shape;
          document.querySelectorAll('[data-shape]').forEach((b) => b.classList.toggle('active', b === btn));
          if (this.mode === 'play') this.setMode('draw');
        });
      });

      // Instrument palette buttons
      document.querySelectorAll('[data-inst]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.drawInstrument = btn.dataset.inst;
          document.querySelectorAll('[data-inst]').forEach((b) => b.classList.toggle('active', b === btn));
          // Auto-switch shape suggestion: bongos/drums work great as pads OR strings, keep user choice
          this.audio.ensureContext();
          // Audition sound preview!
          const sampleNote = AudioLib.lengthToNote(0.32, this.drawInstrument, this.key, this.scale);
          this.audio.trigger(this.drawInstrument, sampleNote, 0.72, 0.5);
        });
      });

      // Preset selector
      document.querySelectorAll('[data-preset]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = btn.dataset.preset;
          this.items = buildPreset(p);
          this.selectedId = null;
          document.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('active', b === btn));
          this.renderRack();
          this.showToast('Loaded preset: ' + btn.textContent.trim());
        });
      });

      // Key & Scale
      const keySel = document.getElementById('as-key');
      const scaleSel = document.getElementById('as-scale');
      if (keySel) {
        keySel.addEventListener('change', () => {
          this.key = keySel.value;
          this.retuneMelodicStrings();
        });
      }
      if (scaleSel) {
        scaleSel.addEventListener('change', () => {
          this.scale = scaleSel.value;
          this.retuneMelodicStrings();
        });
      }

      // Fretboard toggle
      const fretBtn = document.getElementById('as-fret-toggle');
      if (fretBtn) {
        fretBtn.addEventListener('click', () => {
          this.fretboardMode = !this.fretboardMode;
          fretBtn.classList.toggle('active', this.fretboardMode);
          fretBtn.setAttribute('aria-pressed', String(this.fretboardMode));
          this.showToast(
            this.fretboardMode
              ? 'Fretboard ON: pluck left-to-right along any string to play scale notes!'
              : 'Fretboard OFF: each string plays its tuned note (position shifts tone).'
          );
        });
      }

      // Background blur / replacement mode
      const bgSel = document.getElementById('as-bg-mode');
      if (bgSel) {
        bgSel.addEventListener('change', async () => {
          this.bgMode = bgSel.value;
          if (this.bgMode === 'none') {
            this.hasMask = false;
            this.showToast('Background set to Normal');
            return;
          }
          if (!this.cameraActive) {
            this.showToast('Background effect ready — enable your webcam to see it!');
            return;
          }
          await this._ensureSegmenter();
        });
      }

      // Finger mode & hand skeleton style & labels
      const fingerSel = document.getElementById('as-finger-mode');
      if (fingerSel) {
        fingerSel.addEventListener('change', () => {
          this.fingerMode = fingerSel.value;
        });
      }

      const styleSel = document.getElementById('as-hand-style');
      if (styleSel) {
        styleSel.addEventListener('change', () => {
          this.handStyle = styleSel.value;
        });
      }

      const labelToggle = document.getElementById('as-labels-toggle');
      if (labelToggle) {
        labelToggle.addEventListener('click', () => {
          this.showLabels = !this.showLabels;
          labelToggle.classList.toggle('active', this.showLabels);
          labelToggle.setAttribute('aria-pressed', String(this.showLabels));
        });
      }

      // Sliders: Volume, Reverb, Echo, Video Dimmer
      const bindRange = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => fn(parseFloat(el.value)));
      };
      bindRange('as-volume', (v) => this.audio.setVolume(v));
      bindRange('as-reverb', (v) => this.audio.setReverb(v));
      bindRange('as-echo', (v) => this.audio.setEcho(v));
      bindRange('as-dimmer', (v) => { this.videoDimmer = v; });

      // Stage action buttons: Undo, Clear, Save Rig, Load Rig
      const undoBtn = document.getElementById('as-undo-item');
      if (undoBtn) {
        undoBtn.addEventListener('click', () => {
          if (!this.items.length) return;
          this.items.pop();
          this.selectedId = null;
          this.renderRack();
          this.showToast('Removed last string/pad');
        });
      }

      const clearBtn = document.getElementById('as-clear-items');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.items = [];
          this.selectedId = null;
          this.renderRack();
          this.showToast('Stage cleared — draw new strings or pick a preset!');
        });
      }

      const saveBtn = document.getElementById('as-save-rig');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          try {
            const payload = {
              key: this.key,
              scale: this.scale,
              bpm: this.bpm,
              items: this.items.map((it) => ({
                shape: it.shape,
                x1: it.x1, y1: it.y1, x2: it.x2, y2: it.y2,
                cx: it.cx, cy: it.cy, r: it.r,
                instrument: it.instrument,
                note: it.note,
                color: it.color,
              })),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            this.showToast('Saved custom rig to your browser!');
          } catch (_) {
            this.showToast('Could not save rig (storage blocked)');
          }
        });
      }

      const loadBtn = document.getElementById('as-load-rig');
      if (loadBtn) {
        loadBtn.addEventListener('click', () => {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
              this.showToast('No saved rig yet — build one and click Save Rig.');
              return;
            }
            const data = JSON.parse(raw);
            if (Array.isArray(data.items)) {
              this.items = data.items.map((it) =>
                it.shape === 'pad'
                  ? createPad(it.cx, it.cy, it.r, it.instrument, it.note, it.color)
                  : createString(it.x1, it.y1, it.x2, it.y2, it.instrument, it.note, it.color)
              );
              if (data.key) {
                this.key = data.key;
                if (keySel) keySel.value = data.key;
              }
              if (data.scale) {
                this.scale = data.scale;
                if (scaleSel) scaleSel.value = data.scale;
              }
              if (data.bpm) this.setBpm(data.bpm);
              this.selectedId = null;
              this.renderRack();
              this.showToast('Loaded your saved rig!');
            }
          } catch (_) {
            this.showToast('Saved rig could not be loaded');
          }
        });
      }

      // ── Transport / Beat Looper / Backing Groove ──────────────────────────
      const bpmInput = document.getElementById('as-bpm');
      const bpmVal = document.getElementById('as-bpm-val');
      if (bpmInput) {
        bpmInput.addEventListener('input', () => {
          this.setBpm(parseInt(bpmInput.value, 10));
          if (bpmVal) bpmVal.textContent = String(this.bpm);
        });
      }

      const tapBtn = document.getElementById('as-tap-bpm');
      if (tapBtn) {
        tapBtn.addEventListener('click', () => {
          const now = performance.now();
          this._tapTimes = this._tapTimes.filter((t) => now - t < 2500);
          this._tapTimes.push(now);
          if (this._tapTimes.length >= 2) {
            let sum = 0;
            for (let i = 1; i < this._tapTimes.length; i++) {
              sum += this._tapTimes[i] - this._tapTimes[i - 1];
            }
            const avg = sum / (this._tapTimes.length - 1);
            const bpm = Math.round(60000 / avg);
            this.setBpm(bpm);
          }
        });
      }

      const metroBtn = document.getElementById('as-metro-btn');
      if (metroBtn) {
        metroBtn.addEventListener('click', () => {
          this.audio.ensureContext();
          this.metronomeOn = !this.metronomeOn;
          metroBtn.classList.toggle('active', this.metronomeOn);
          metroBtn.setAttribute('aria-pressed', String(this.metronomeOn));
          this._syncTransport();
        });
      }

      const grooveSel = document.getElementById('as-groove');
      if (grooveSel) {
        grooveSel.addEventListener('change', () => {
          this.audio.ensureContext();
          this.backingGroove = grooveSel.value;
          this._syncTransport();
        });
      }

      const barsSel = document.getElementById('as-loop-bars');
      if (barsSel) {
        barsSel.addEventListener('change', () => {
          this.loopBars = parseInt(barsSel.value, 10) || 2;
        });
      }

      const quantSel = document.getElementById('as-quantize');
      if (quantSel) {
        quantSel.addEventListener('change', () => {
          this.quantize = quantSel.value;
        });
      }

      const recBtn = document.getElementById('as-loop-rec');
      if (recBtn) {
        recBtn.addEventListener('click', () => this.toggleLoopRecord());
      }

      const playBtn = document.getElementById('as-loop-play');
      if (playBtn) {
        playBtn.addEventListener('click', () => this.toggleLoopPlay());
      }

      const undoLayerBtn = document.getElementById('as-loop-undo');
      if (undoLayerBtn) {
        undoLayerBtn.addEventListener('click', () => {
          if (!this.loopEvents.length) return;
          const maxLayer = Math.max(...this.loopEvents.map((e) => e.layerId));
          this.loopEvents = this.loopEvents.filter((e) => e.layerId !== maxLayer);
          this.updateLooperUI();
          this.showToast('Undid last loop layer');
        });
      }

      const clearLoopBtn = document.getElementById('as-loop-clear');
      if (clearLoopBtn) {
        clearLoopBtn.addEventListener('click', () => {
          this.loopEvents = [];
          this.loopState = 'idle';
          this._syncTransport();
          this.updateLooperUI();
          this.showToast('Loop cleared');
        });
      }

      // WAV Audio Export Recorder
      const wavBtn = document.getElementById('as-wav-btn');
      if (wavBtn) {
        wavBtn.addEventListener('click', () => {
          this.audio.ensureContext();
          if (!this.audio.isRecordingWav) {
            this.audio.startWavRecording();
            wavBtn.classList.add('recording');
            wavBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">stop_circle</span>Stop &amp; Save WAV';
            this.showToast('Recording live audio — jam away, then click Stop & Save WAV!');
          } else {
            const blob = this.audio.stopWavRecording();
            wavBtn.classList.remove('recording');
            wavBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">download</span>Record WAV';
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'air-strings-beat-' + Date.now() + '.wav';
              document.body.appendChild(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(url), 4000);
              this.showToast('Downloaded your WAV beat!');
            }
          }
        });
      }

      // Keyboard shortcuts (1 Play, 2 Draw, 3 Edit, Space Play/Pause Loop, R Record Loop, Delete selected)
      window.addEventListener('keydown', (e) => {
        if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        if (e.key === '1') this.setMode('play');
        else if (e.key === '2') this.setMode('draw');
        else if (e.key === '3') this.setMode('edit');
        else if (e.key === 'r' || e.key === 'R') this.toggleLoopRecord();
        else if (e.code === 'Space') {
          e.preventDefault();
          this.toggleLoopPlay();
        } else if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedId) {
          this.deleteItem(this.selectedId);
        }
      });

      window.addEventListener('resize', () => this.resizeCanvas());
      if (typeof ResizeObserver !== 'undefined' && this.stage) {
        this._ro = new ResizeObserver(() => this.resizeCanvas());
        this._ro.observe(this.stage);
      }
    }

    setMode(mode) {
      this.mode = mode;
      document.querySelectorAll('[data-mode]').forEach((b) => {
        b.classList.toggle('active', b.dataset.mode === mode);
      });
      if (this.canvas) {
        this.canvas.classList.toggle('cursor-crosshair', mode === 'draw');
        this.canvas.classList.toggle('cursor-move', mode === 'edit');
      }
      if (mode === 'draw') {
        this.showToast('Draw Mode: drag with mouse OR pinch thumb + index in mid-air!');
      } else if (mode === 'edit') {
        this.showToast('Edit Mode: drag anchors to move/resize, right-click to delete.');
      }
    }

    setBpm(bpm) {
      this.bpm = Math.max(60, Math.min(180, bpm));
      this.audio.setBpm(this.bpm);
      const bpmInput = document.getElementById('as-bpm');
      const bpmVal = document.getElementById('as-bpm-val');
      if (bpmInput) bpmInput.value = String(this.bpm);
      if (bpmVal) bpmVal.textContent = String(this.bpm);
    }

    retuneMelodicStrings() {
      this.items.forEach((it) => {
        const inst = AudioLib.INSTRUMENTS[it.instrument];
        if (!inst || inst.kind !== 'melodic') return;
        if (it.shape === 'string') {
          const len = Math.hypot(it.x2 - it.x1, it.y2 - it.y1);
          it.note = AudioLib.lengthToNote(len, it.instrument, this.key, this.scale);
          it.lastHitNote = it.note;
        }
      });
      this.renderRack();
      this.showToast(`Tuned melodic strings to ${this.key} ${AudioLib.SCALES[this.scale].label}`);
    }

    // ── Webcam + MediaPipe Hand Landmarker ──────────────────────────────────
    async toggleCamera() {
      this.audio.ensureContext();
      if (this.cameraActive) {
        this.stopCamera();
        return;
      }
      if (this.loadingModel) return;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.setStatus('Webcam unavailable (requires HTTPS or localhost). Mouse Play still works!', 'error');
        this.showToast('No webcam API available — use Mouse/Touch Play Mode!');
        return;
      }

      this.loadingModel = true;
      this.setStatus('Requesting webcam permission…', 'loading');
      if (this.camBtn) this.camBtn.disabled = true;

      try {
        await this._openCameraStream();

        if (this.camOverlay) this.camOverlay.classList.add('hidden');
        this.cameraActive = true;
        this.resizeCanvas();

        if (!this.handLandmarker) {
          this.setStatus('Loading on-device Hand Tracking AI model…', 'loading');
          await this._initHandLandmarker();
        }

        if (this.bgMode !== 'none' && !this.imageSegmenter) {
          await this._ensureSegmenter();
        }

        this.setStatus('Tracking live — wave your hands to play!', 'live');
        if (this.camBtn) {
          this.camBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">videocam_off</span>Stop Camera';
          this.camBtn.classList.add('active');
        }
        if (this.flipCamBtn) this.flipCamBtn.hidden = false;
        this.showToast('Hand tracking active! Strum across any neon string or strike a pad.');
      } catch (err) {
        console.error('Air Strings camera/model error:', err);
        this.stopCamera();
        const msg =
          err && err.name === 'NotAllowedError'
            ? 'Camera access denied. Allow webcam permission or play with touch/mouse!'
            : err && err.name === 'NotFoundError'
            ? 'No camera detected. You can still strum & make beats with touch/mouse!'
            : 'Could not start hand tracking (' + (err && err.message ? err.message : 'error') + ').';
        this.setStatus(msg, 'error');
        this.showToast(msg);
      } finally {
        this.loadingModel = false;
        if (this.camBtn) this.camBtn.disabled = false;
      }
    }

    async _openCameraStream() {
      const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || window.innerWidth < 820;
      const attempts = [
        {
          video: {
            facingMode: { ideal: this.facingMode },
            width: { ideal: mobile ? 640 : 1280 },
            height: { ideal: mobile ? 480 : 720 },
            frameRate: { ideal: 30 },
          },
          audio: false,
        },
        { video: { facingMode: this.facingMode }, audio: false },
        { video: true, audio: false },
      ];

      let lastErr = null;
      for (const constraints of attempts) {
        try {
          this.stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (err) {
          lastErr = err;
          if (err && err.name === 'NotAllowedError') throw err;
        }
      }
      if (!this.stream) throw lastErr || new Error('Camera unavailable');

      this.video.srcObject = this.stream;
      this.video.muted = true;
      this.video.playsInline = true;
      this.video.setAttribute('playsinline', '');
      this.video.setAttribute('muted', '');

      await new Promise((resolve) => {
        if (this.video.readyState >= 1 && this.video.videoWidth > 0) return resolve();
        const done = () => {
          this.video.removeEventListener('loadedmetadata', done);
          this.video.removeEventListener('canplay', done);
          resolve();
        };
        this.video.addEventListener('loadedmetadata', done, { once: true });
        this.video.addEventListener('canplay', done, { once: true });
        setTimeout(done, 1500);
      });

      await this.video.play();
      this.lastVideoTime = -1;
      this._lastDetectWallMs = 0;
    }

    async flipCamera() {
      if (!this.cameraActive || this.loadingModel) return;
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop());
        this.stream = null;
      }
      this.hasMask = false;
      this.prevPointerMap.clear();
      this.insidePadSet.clear();
      try {
        await this._openCameraStream();
        this.showToast(this.facingMode === 'user' ? 'Switched to Front Camera' : 'Switched to Rear Camera');
      } catch (err) {
        this.showToast('Could not switch camera on this device');
      }
    }

    async _ensureVisionFileset() {
      if (!this.visionMod) {
        this.visionMod = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs');
      }
      if (!this.visionFileset) {
        this.visionFileset = await this.visionMod.FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );
      }
      return { visionMod: this.visionMod, vision: this.visionFileset };
    }

    async _initHandLandmarker(forceDelegate = null) {
      const { visionMod, vision } = await this._ensureVisionFileset();
      const { HandLandmarker } = visionMod;

      const modelUrl =
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

      const conf = this.isMobile ? 0.35 : 0.45;
      const tryCreate = async (delegate) => {
        const instance = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelUrl, delegate },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: conf,
          minHandPresenceConfidence: conf,
          minTrackingConfidence: conf,
        });
        this._handDelegate = delegate;
        this._handErrorCount = 0;
        return instance;
      };

      if (this.handLandmarker && typeof this.handLandmarker.close === 'function') {
        try { this.handLandmarker.close(); } catch (_) {}
        this.handLandmarker = null;
      }

      if (forceDelegate) {
        this.handLandmarker = await tryCreate(forceDelegate);
        return;
      }

      // Android/mobile WebGL GPU delegates frequently return empty landmarks silently;
      // use CPU on mobile with a downscaled 2D canvas frame for reliable detection.
      if (this.isMobile) {
        this.handLandmarker = await tryCreate('CPU');
        return;
      }

      try {
        this.handLandmarker = await tryCreate('GPU');
      } catch (_) {
        this.handLandmarker = await tryCreate('CPU');
      }
    }

    async _ensureSegmenter() {
      if (this.imageSegmenter || this.loadingSegmenter) return;
      this.loadingSegmenter = true;
      this.setStatus('Loading on-device background blur model…', 'loading');
      try {
        const { visionMod, vision } = await this._ensureVisionFileset();
        const { ImageSegmenter } = visionMod;
        const segUrl =
          'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite';

        const createSeg = (delegate) =>
          ImageSegmenter.createFromOptions(vision, {
            baseOptions: { modelAssetPath: segUrl, delegate },
            runningMode: 'VIDEO',
            outputCategoryMask: false,
            outputConfidenceMasks: true,
          });

        if (this.isMobile) {
          this.imageSegmenter = await createSeg('CPU');
        } else {
          try {
            this.imageSegmenter = await createSeg('GPU');
          } catch (_) {
            this.imageSegmenter = await createSeg('CPU');
          }
        }
        if (this.cameraActive) {
          this.setStatus('Tracking live — background effect active!', 'live');
          this.showToast('Background effect active!');
        }
      } catch (err) {
        console.error('Air Strings segmenter error:', err);
        this.bgMode = 'none';
        const bgSel = document.getElementById('as-bg-mode');
        if (bgSel) bgSel.value = 'none';
        this.showToast('Could not load background blur model on this browser.');
        if (this.cameraActive) this.setStatus('Tracking live — wave your hands to play!', 'live');
      } finally {
        this.loadingSegmenter = false;
      }
    }

    stopCamera() {
      this.cameraActive = false;
      this.hasMask = false;
      this.latestHands = [];
      this.prevPointerMap.clear();
      this.insidePadSet.clear();
      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop());
        this.stream = null;
      }
      if (this.video) this.video.srcObject = null;
      if (this.camBtn) {
        this.camBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">videocam</span>Start Webcam';
        this.camBtn.classList.remove('active');
      }
      if (this.flipCamBtn) this.flipCamBtn.hidden = true;
      this.setStatus('Camera off — Mouse / Touch Play Mode active', 'idle');
    }

    // ── Canvas Sizing & Pointer Interaction ─────────────────────────────────
    resizeCanvas() {
      if (!this.canvas || !this.stage) return;
      const rect = this.stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, Math.round(rect.width));
      const h = Math.max(200, Math.round(rect.height));
      if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr)) {
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
      }
      this.viewW = w;
      this.viewH = h;
      this.dpr = dpr;
    }

    _getCanvasNormPos(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      };
    }

    bindCanvasEvents() {
      if (!this.canvas) return;

      const onDown = (clientX, clientY, button = 0) => {
        this.audio.ensureContext();
        const pos = this._getCanvasNormPos(clientX, clientY);

        if (button === 2) {
          const hit = this._findItemAt(pos.x, pos.y);
          if (hit) this.deleteItem(hit.item.id);
          return;
        }

        if (this.mode === 'draw') {
          this.mouseDraw = {
            shape: this.drawShape,
            x1: pos.x,
            y1: pos.y,
            x2: pos.x,
            y2: pos.y,
          };
          return;
        }

        if (this.mode === 'edit') {
          const hit = this._findItemAt(pos.x, pos.y);
          if (hit) {
            this.selectedId = hit.item.id;
            this.editDrag = {
              id: hit.item.id,
              part: hit.part,
              lastX: pos.x,
              lastY: pos.y,
            };
            this.renderRack();
          } else {
            this.selectedId = null;
            this.renderRack();
          }
          return;
        }

        // Play mode click/tap: strike any pad directly under pointer, or tap-pluck nearby string
        const now = performance.now();
        const px = pos.x * this.viewW;
        const py = pos.y * this.viewH;
        for (const it of this.items) {
          if (it.shape === 'pad') {
            const dx = (pos.x - it.cx) * this.viewW;
            const dy = (pos.y - it.cy) * this.viewH;
            const rPx = it.r * Math.min(this.viewW, this.viewH);
            if (Math.hypot(dx, dy) <= rPx) {
              this.triggerItem(it, 0.85, 0.5, pos.x, pos.y, true);
              return;
            }
          }
        }
        for (const it of this.items) {
          if (it.shape === 'string') {
            const x1 = it.x1 * this.viewW;
            const y1 = it.y1 * this.viewH;
            const x2 = it.x2 * this.viewW;
            const y2 = it.y2 * this.viewH;
            if (distToSegment(px, py, x1, y1, x2, y2) <= 22) {
              const dx = x2 - x1;
              const dy = y2 - y1;
              const lenSq = dx * dx + dy * dy || 1;
              const t = Math.max(0.05, Math.min(0.95, ((px - x1) * dx + (py - y1) * dy) / lenSq));
              this.triggerItem(it, 0.82, t, pos.x, pos.y, true);
              return;
            }
          }
        }
        this.prevMouse = { x: pos.x, y: pos.y, time: now };
      };

      const onMove = (clientX, clientY) => {
        const pos = this._getCanvasNormPos(clientX, clientY);
        const now = performance.now();

        if (this.mode === 'draw' && this.mouseDraw) {
          this.mouseDraw.x2 = pos.x;
          this.mouseDraw.y2 = pos.y;
          return;
        }

        if (this.mode === 'edit' && this.editDrag) {
          const it = this.items.find((x) => x.id === this.editDrag.id);
          if (!it) return;
          const dx = pos.x - this.editDrag.lastX;
          const dy = pos.y - this.editDrag.lastY;
          this.editDrag.lastX = pos.x;
          this.editDrag.lastY = pos.y;

          if (it.shape === 'string') {
            if (this.editDrag.part === 'a') {
              it.x1 = pos.x;
              it.y1 = pos.y;
            } else if (this.editDrag.part === 'b') {
              it.x2 = pos.x;
              it.y2 = pos.y;
            } else {
              it.x1 = Math.max(0.02, Math.min(0.98, it.x1 + dx));
              it.y1 = Math.max(0.02, Math.min(0.98, it.y1 + dy));
              it.x2 = Math.max(0.02, Math.min(0.98, it.x2 + dx));
              it.y2 = Math.max(0.02, Math.min(0.98, it.y2 + dy));
            }
          } else if (it.shape === 'pad') {
            if (this.editDrag.part === 'radius') {
              const dist = Math.hypot((pos.x - it.cx) * this.viewW, (pos.y - it.cy) * this.viewH);
              it.r = Math.max(0.04, Math.min(0.18, dist / Math.min(this.viewW, this.viewH)));
            } else {
              it.cx = Math.max(0.05, Math.min(0.95, it.cx + dx));
              it.cy = Math.max(0.05, Math.min(0.95, it.cy + dy));
            }
          }
          return;
        }

        if (this.mode === 'play') {
          if (this.prevMouse && now - this.prevMouse.time < 180) {
            this._processPointerMotion('mouse', this.prevMouse, pos, now - this.prevMouse.time);
          }
          this.prevMouse = { x: pos.x, y: pos.y, time: now };
        }
      };

      const onUp = () => {
        if (this.mode === 'draw' && this.mouseDraw) {
          this._commitDrawnItem(this.mouseDraw);
          this.mouseDraw = null;
        }
        this.editDrag = null;
      };

      this.canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY, e.button));
      window.addEventListener('mousemove', (e) => {
        if (this.mouseDraw || this.editDrag || e.target === this.canvas) {
          onMove(e.clientX, e.clientY);
        }
      });
      window.addEventListener('mouseup', onUp);
      this.canvas.addEventListener('mouseleave', () => {
        this.prevMouse = null;
      });
      this.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      // Multi-touch support (non-passive so Android/iOS doesn't scroll while strumming)
      this.canvas.addEventListener(
        'touchstart',
        (e) => {
          if (!e.changedTouches.length) return;
          e.preventDefault();
          this.audio.ensureContext();
          if (this.mode === 'play') {
            const now = performance.now();
            for (let i = 0; i < e.changedTouches.length; i++) {
              const t = e.changedTouches[i];
              const pos = this._getCanvasNormPos(t.clientX, t.clientY);
              this.activeTouches.set(t.identifier, { x: pos.x, y: pos.y, time: now });
              onDown(t.clientX, t.clientY, 0);
            }
          } else {
            const t = e.changedTouches[0];
            onDown(t.clientX, t.clientY, 0);
          }
        },
        { passive: false }
      );
      this.canvas.addEventListener(
        'touchmove',
        (e) => {
          if (!e.changedTouches.length) return;
          e.preventDefault();
          if (this.mode === 'play') {
            const now = performance.now();
            for (let i = 0; i < e.changedTouches.length; i++) {
              const t = e.changedTouches[i];
              const pos = this._getCanvasNormPos(t.clientX, t.clientY);
              const prev = this.activeTouches.get(t.identifier);
              if (prev && now - prev.time < 220) {
                this._processPointerMotion('t_' + t.identifier, prev, pos, now - prev.time);
              }
              this.activeTouches.set(t.identifier, { x: pos.x, y: pos.y, time: now });
            }
          } else {
            const t = e.changedTouches[0];
            onMove(t.clientX, t.clientY);
          }
        },
        { passive: false }
      );
      const onTouchEnd = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          this.activeTouches.delete(e.changedTouches[i].identifier);
        }
        if (!e.touches.length) {
          onUp();
          this.prevMouse = null;
        }
      };
      this.canvas.addEventListener('touchend', onTouchEnd);
      this.canvas.addEventListener('touchcancel', onTouchEnd);
    }

    _commitDrawnItem(draft) {
      const dist = Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1);
      const inst = AudioLib.INSTRUMENTS[this.drawInstrument] || AudioLib.INSTRUMENTS.guitar;
      const color = this.drawColor === 'auto' ? inst.color : this.drawColor;

      if (draft.shape === 'pad') {
        const r = Math.max(0.055, Math.min(0.14, dist > 0.03 ? dist : 0.072));
        const note = AudioLib.lengthToNote(r * 3.5, this.drawInstrument, this.key, this.scale);
        const pad = createPad(draft.x1, draft.y1, r, this.drawInstrument, note, color);
        this.items.push(pad);
        this.selectedId = pad.id;
        this.triggerItem(pad, 0.8, 0.5, pad.cx, pad.cy, false);
        this.renderRack();
        this.showToast(`Added ${inst.label} pad (${AudioLib.getDisplayLabel(pad.instrument, pad.note)})`);
        return;
      }

      if (dist < 0.055) return; // Too tiny, ignore accidental tap
      const note = AudioLib.lengthToNote(dist, this.drawInstrument, this.key, this.scale);
      const str = createString(draft.x1, draft.y1, draft.x2, draft.y2, this.drawInstrument, note, color);
      this.items.push(str);
      this.selectedId = str.id;
      this.triggerItem(str, 0.82, 0.5, (str.x1 + str.x2) / 2, (str.y1 + str.y2) / 2, false);
      this.renderRack();
      this.showToast(`Added ${inst.label} string (${AudioLib.getDisplayLabel(str.instrument, str.note)})`);
    }

    _findItemAt(nx, ny) {
      const px = nx * this.viewW;
      const py = ny * this.viewH;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const it = this.items[i];
        if (it.shape === 'string') {
          const x1 = it.x1 * this.viewW;
          const y1 = it.y1 * this.viewH;
          const x2 = it.x2 * this.viewW;
          const y2 = it.y2 * this.viewH;
          if (Math.hypot(px - x1, py - y1) < 20) return { item: it, part: 'a' };
          if (Math.hypot(px - x2, py - y2) < 20) return { item: it, part: 'b' };
          if (distToSegment(px, py, x1, y1, x2, y2) < 16) return { item: it, part: 'body' };
        } else {
          const cx = it.cx * this.viewW;
          const cy = it.cy * this.viewH;
          const rPx = it.r * Math.min(this.viewW, this.viewH);
          const d = Math.hypot(px - cx, py - cy);
          if (Math.abs(d - rPx) < 14) return { item: it, part: 'radius' };
          if (d < rPx) return { item: it, part: 'center' };
        }
      }
      return null;
    }

    deleteItem(id) {
      this.items = this.items.filter((x) => x.id !== id);
      if (this.selectedId === id) this.selectedId = null;
      this.renderRack();
    }

    // ── Hand & Pointer Collision + Pluck Triggering ─────────────────────────
    _processPointerMotion(pointerId, prev, curr, dtMs) {
      const now = performance.now();
      const dt = Math.max(8, dtMs || 16);
      const speedPx = Math.hypot((curr.x - prev.x) * this.viewW, (curr.y - prev.y) * this.viewH) / (dt / 16.67);
      const velocity = Math.max(0.35, Math.min(1.0, 0.32 + speedPx / 34));

      for (const it of this.items) {
        const coolKey = pointerId + ':' + it.id;

        if (it.shape === 'string') {
          const hit = segmentsIntersect(prev, curr, { x: it.x1, y: it.y1 }, { x: it.x2, y: it.y2 });
          if (hit) {
            const last = this.cooldownMap.get(coolKey) || 0;
            if (now - last > 85) {
              this.cooldownMap.set(coolKey, now);
              this.triggerItem(it, velocity, hit.t, hit.x, hit.y, true);
            }
          }
        } else if (it.shape === 'pad') {
          const rNormX = (it.r * Math.min(this.viewW, this.viewH)) / this.viewW;
          const rNormY = (it.r * Math.min(this.viewW, this.viewH)) / this.viewH;
          const inNow = Math.hypot((curr.x - it.cx) / rNormX, (curr.y - it.cy) / rNormY) <= 1.0;
          const wasIn = this.insidePadSet.has(coolKey);

          if (inNow && !wasIn) {
            const last = this.cooldownMap.get(coolKey) || 0;
            if (now - last > 105) {
              this.cooldownMap.set(coolKey, now);
              this.triggerItem(it, Math.max(0.55, velocity), 0.5, it.cx, it.cy, true);
            }
            this.insidePadSet.add(coolKey);
          } else if (!inNow && wasIn) {
            this.insidePadSet.delete(coolKey);
          }
        }
      }
    }

    triggerItem(it, velocity = 0.8, pluckT = 0.5, hitX = 0.5, hitY = 0.5, recordable = true) {
      this.audio.ensureContext();
      let actualNote = it.note;

      // Optional Fretboard Mode: divide melodic string into 5 consecutive scale notes
      const inst = AudioLib.INSTRUMENTS[it.instrument];
      if (this.fretboardMode && it.shape === 'string' && inst && inst.kind === 'melodic') {
        const scaleNotes = AudioLib.getScaleNotes(this.key, this.scale, 2, 5);
        let baseIdx = scaleNotes.indexOf(it.note);
        if (baseIdx === -1) {
          const targetMidi = AudioLib.noteToMidi(it.note);
          baseIdx = scaleNotes.findIndex((n) => AudioLib.noteToMidi(n) >= targetMidi);
          if (baseIdx < 0) baseIdx = 0;
        }
        const fretStep = Math.min(4, Math.floor(pluckT * 5));
        actualNote = scaleNotes[Math.min(scaleNotes.length - 1, baseIdx + fretStep)] || it.note;
      }

      this.audio.trigger(it.instrument, actualNote, velocity, pluckT);
      this._triggerVisualHit(it, actualNote, velocity, pluckT, hitX, hitY);

      if (recordable && (this.loopState === 'recording' || this.loopState === 'overdub')) {
        this._recordLoopHit(it, actualNote, velocity, pluckT);
      }
    }

    _triggerVisualHit(it, actualNote, velocity, pluckT, hitX, hitY) {
      it.vibAmp = 12 + velocity * 24;
      it.vibPhase = 0;
      it.pluckT = pluckT;
      it.flash = 1.0;
      it.lastHitNote = actualNote;

      const label = AudioLib.getDisplayLabel(it.instrument, actualNote);
      const instLabel = AudioLib.INSTRUMENTS[it.instrument] ? AudioLib.INSTRUMENTS[it.instrument].label : '';
      this.hitBanner = { text: `${instLabel.toUpperCase()} · ${label}`, color: it.color, alpha: 1.0 };

      const sx = hitX * this.viewW;
      const sy = hitY * this.viewH;

      // Emit glowing sparks
      const count = 12 + Math.round(velocity * 18);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1.6 + Math.random() * (4.8 * velocity + 2.0);
        this.sparks.push({
          x: sx,
          y: sy,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 0.6,
          life: 1.0,
          decay: 0.024 + Math.random() * 0.028,
          size: 1.5 + Math.random() * 2.6,
          color: Math.random() < 0.35 ? '#ffffff' : it.color,
        });
      }

      // Emit shockwave ring
      this.ripples.push({
        x: sx,
        y: sy,
        r: it.shape === 'pad' ? it.r * Math.min(this.viewW, this.viewH) * 0.6 : 6,
        maxR: it.shape === 'pad' ? it.r * Math.min(this.viewW, this.viewH) * 1.65 : 54 + velocity * 28,
        alpha: 0.85,
        color: it.color,
      });
    }

    // ── Video Cover-Fit & Landmark Coordinate Mapping (Desktop + Portrait Mobile) ──
    _getVideoRect(W, H) {
      const vw = (this.video && this.video.videoWidth) || 1280;
      const vh = (this.video && this.video.videoHeight) || 720;
      const scale = Math.max(W / vw, H / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      return {
        dx: (W - dw) * 0.5,
        dy: (H - dh) * 0.5,
        dw,
        dh,
        mirrored: this.facingMode === 'user',
      };
    }

    _mapLandmarkNorm(lmPt, rect, W, H) {
      const rawX = rect.dx + lmPt.x * rect.dw;
      const px = rect.mirrored ? W - rawX : rawX;
      const py = rect.dy + lmPt.y * rect.dh;
      return { x: px / W, y: py / H };
    }

    // ── Hand Tracking Processing (CV Play + Pinch-to-Draw) ──────────────────
    _processHandLandmarks(hands) {
      const now = performance.now();
      const activeTips = this.fingerMode === 'index' ? INDEX_ONLY : ALL_FINGERTIPS;
      const W = this.viewW || 640;
      const H = this.viewH || 360;
      const aspect = W / Math.max(1, H);
      const rect = this._getVideoRect(W, H);

      // Reset pinch states for hands not currently visible
      for (let h = hands.length; h < 2; h++) {
        if (this.handPinch[h].active && this.mode === 'draw' && !this.twoHandDraw) {
          this._commitDrawnItem({
            shape: this.drawShape,
            x1: this.handPinch[h].startX,
            y1: this.handPinch[h].startY,
            x2: this.handPinch[h].x,
            y2: this.handPinch[h].y,
          });
        }
        this.handPinch[h].active = false;
      }

      hands.forEach((lm, handIdx) => {
        if (handIdx > 1) return;

        // Pinch detection (Thumb Tip 4 <-> Index Tip 8)
        const thumb = this._mapLandmarkNorm(lm[4], rect, W, H);
        const index = this._mapLandmarkNorm(lm[8], rect, W, H);
        const pinchDist = Math.hypot((thumb.x - index.x) * aspect, thumb.y - index.y);
        const midX = (thumb.x + index.x) * 0.5;
        const midY = (thumb.y + index.y) * 0.5;

        const pState = this.handPinch[handIdx];
        if (!pState.active && pinchDist < 0.052) {
          pState.active = true;
          pState.startX = midX;
          pState.startY = midY;
          pState.x = midX;
          pState.y = midY;
        } else if (pState.active && pinchDist > 0.082) {
          // Released pinch
          if (this.mode === 'draw' && !this.twoHandDraw) {
            this._commitDrawnItem({
              shape: this.drawShape,
              x1: pState.startX,
              y1: pState.startY,
              x2: pState.x,
              y2: pState.y,
            });
          }
          pState.active = false;
        } else if (pState.active) {
          pState.x = midX;
          pState.y = midY;
        }

        // Play mode: track every active fingertip across strings & pads
        if (this.mode === 'play') {
          for (const tipIdx of activeTips) {
            const pt = this._mapLandmarkNorm(lm[tipIdx], rect, W, H);
            const pid = `h${handIdx}_f${tipIdx}`;
            const prev = this.prevPointerMap.get(pid);
            if (prev && now - prev.time < 220) {
              this._processPointerMotion(pid, prev, pt, now - prev.time);
            }
            this.prevPointerMap.set(pid, { x: pt.x, y: pt.y, time: now });
          }
        }
      });

      // Two-hand pinch stretch in Draw Mode!
      if (this.mode === 'draw') {
        if (this.handPinch[0].active && this.handPinch[1].active) {
          this.twoHandDraw = {
            shape: 'string',
            x1: this.handPinch[0].x,
            y1: this.handPinch[0].y,
            x2: this.handPinch[1].x,
            y2: this.handPinch[1].y,
          };
        } else if (this.twoHandDraw) {
          this._commitDrawnItem(this.twoHandDraw);
          this.twoHandDraw = null;
          // Prevent the still-held hand from immediately committing a duplicate single-hand string
          this.handPinch[0].active = false;
          this.handPinch[1].active = false;
        }
      } else {
        this.twoHandDraw = null;
      }
    }

    // ── Live Beat Looper, Metronome & Backing Groove Scheduler ──────────────
    _syncTransport() {
      const shouldRun =
        this.metronomeOn ||
        this.backingGroove !== 'off' ||
        this.loopState === 'countin' ||
        this.loopState === 'recording' ||
        this.loopState === 'playing' ||
        this.loopState === 'overdub';

      if (shouldRun && !this.transportRunning) {
        const ctx = this.audio.ensureContext();
        this.transportRunning = true;
        this.currentStep = 0;
        this.nextStepTime = ctx.currentTime + 0.06;
        this.transportStartTime = this.nextStepTime;
        this.schedulerTimer = setInterval(() => this._schedulerTick(), 22);
      } else if (!shouldRun && this.transportRunning) {
        this.transportRunning = false;
        clearInterval(this.schedulerTimer);
        this.schedulerTimer = null;
        this.loopProgress = 0;
        this._updateBeatDots(-1);
      }
      this.updateLooperUI();
    }

    toggleLoopRecord() {
      this.audio.ensureContext();
      if (this.loopState === 'idle') {
        // Fresh 4-beat count-in, then record
        this.loopEvents = [];
        this.currentLayerId = 1;
        this.loopState = 'countin';
        this.countInBeatsLeft = 4;
        this._syncTransport();
        this.showToast('Count-in: 4… 3… 2… 1… play your beat!');
      } else if (this.loopState === 'recording' || this.loopState === 'overdub') {
        this.loopState = this.loopEvents.length ? 'playing' : 'idle';
        this._syncTransport();
        this.showToast(this.loopEvents.length ? 'Loop playing!' : 'No notes recorded');
      } else if (this.loopState === 'playing') {
        this.currentLayerId += 1;
        this.loopState = 'overdub';
        this.updateLooperUI();
        this.showToast('Overdubbing layer ' + this.currentLayerId + ' — play on top!');
      } else if (this.loopState === 'countin') {
        this.loopState = 'idle';
        this._syncTransport();
      }
    }

    toggleLoopPlay() {
      this.audio.ensureContext();
      if (this.loopState === 'playing' || this.loopState === 'recording' || this.loopState === 'overdub' || this.loopState === 'countin') {
        this.loopState = 'idle';
        this._syncTransport();
      } else if (this.loopEvents.length > 0) {
        this.loopState = 'playing';
        this._syncTransport();
      } else {
        this.showToast('Hit Record Loop first to lay down a beat!');
      }
    }

    _recordLoopHit(it, actualNote, velocity, pluckT) {
      if (!this.audio.ctx) return;
      const totalBeats = this.loopBars * 4;
      const secPerBeat = 60 / this.bpm;
      const elapsedBeats = (this.audio.ctx.currentTime - this.loopStartTime) / secPerBeat;
      let beatOffset = ((elapsedBeats % totalBeats) + totalBeats) % totalBeats;

      if (this.quantize === '1/16') {
        beatOffset = Math.round(beatOffset * 4) / 4;
      } else if (this.quantize === '1/8') {
        beatOffset = Math.round(beatOffset * 2) / 2;
      }
      if (beatOffset >= totalBeats) beatOffset = 0;

      this.loopEvents.push({
        beatOffset,
        itemId: it.id,
        instrument: it.instrument,
        note: actualNote,
        velocity,
        pluckT,
        layerId: this.currentLayerId,
      });
      this.updateLooperUI();
    }

    _schedulerTick() {
      if (!this.transportRunning || !this.audio.ctx) return;
      const ctx = this.audio.ctx;
      const secPer16th = (60 / this.bpm) / 4;
      const totalSteps = this.loopBars * 16;

      while (this.nextStepTime < ctx.currentTime + 0.1) {
        const stepInBar = this.currentStep % 16;
        const stepInLoop = this.currentStep % totalSteps;
        const isQuarter = stepInBar % 4 === 0;
        const beatInBar = Math.floor(stepInBar / 4);

        // Count-in handling
        if (this.loopState === 'countin' && isQuarter) {
          this.audio.playMetronome(this.countInBeatsLeft === 4, this.nextStepTime);
          const countDisplay = this.countInBeatsLeft;
          const delayMs = Math.max(0, (this.nextStepTime - ctx.currentTime) * 1000);
          setTimeout(() => {
            this.beatPulse = 1.0;
            this._updateBeatDots(4 - countDisplay);
          }, delayMs);

          this.countInBeatsLeft -= 1;
          if (this.countInBeatsLeft <= 0) {
            // Next quarter starts the actual loop!
            const startAt = this.nextStepTime + secPer16th * 4;
            setTimeout(() => {
              if (this.loopState === 'countin') {
                this.loopState = 'recording';
                this.loopStartTime = startAt;
                this.currentStep = 0;
                this.updateLooperUI();
              }
            }, Math.max(0, (startAt - ctx.currentTime) * 1000 - 15));
          }
        } else {
          // Beat 0 of loop resets loopStartTime accurately
          if (stepInLoop === 0) {
            if (this.loopState === 'recording' && this.loopEvents.length > 0 && this.currentStep > 0) {
              this.loopState = 'overdub';
              this.currentLayerId += 1;
              this.updateLooperUI();
            }
            this.loopStartTime = this.nextStepTime;
          }

          // Metronome click
          if (isQuarter && this.metronomeOn) {
            this.audio.playMetronome(beatInBar === 0, this.nextStepTime);
          }

          if (isQuarter) {
            const delayMs = Math.max(0, (this.nextStepTime - ctx.currentTime) * 1000);
            setTimeout(() => {
              if (beatInBar === 0) this.beatPulse = 0.85;
              this._updateBeatDots(beatInBar);
            }, delayMs);
          }

          // Backing drum groove
          if (this.backingGroove !== 'off') {
            const groove = AudioLib.BACKING_GROOVES[this.backingGroove];
            if (groove && groove.steps) {
              for (const [voice, stepsArr] of Object.entries(groove.steps)) {
                if (stepsArr.includes(stepInBar)) {
                  const isBongo = AudioLib.BONGO_VOICES.some((b) => b.id === voice);
                  const instId = isBongo ? 'bongos' : 'drums';
                  const vel = stepInBar % 4 === 0 ? 0.65 : 0.45;
                  this.audio.trigger(instId, voice, vel, 0.5, this.nextStepTime);
                }
              }
            }
          }

          // Loop playback events falling within [stepBeat, stepBeat + 0.25)
          if (this.loopState === 'playing' || this.loopState === 'overdub' || this.loopState === 'recording') {
            const stepBeatStart = stepInLoop * 0.25;
            const stepBeatEnd = stepBeatStart + 0.25;
            for (const ev of this.loopEvents) {
              if (ev.beatOffset >= stepBeatStart && ev.beatOffset < stepBeatEnd) {
                const subOffsetSec = (ev.beatOffset - stepBeatStart) * (60 / this.bpm);
                const playTime = this.nextStepTime + subOffsetSec;
                this.audio.trigger(ev.instrument, ev.note, ev.velocity, ev.pluckT, playTime);

                const delayMs = Math.max(0, (playTime - ctx.currentTime) * 1000);
                setTimeout(() => {
                  const matched = this.items.find((x) => x.id === ev.itemId);
                  if (matched) {
                    const hx = matched.shape === 'pad' ? matched.cx : matched.x1 + (matched.x2 - matched.x1) * ev.pluckT;
                    const hy = matched.shape === 'pad' ? matched.cy : matched.y1 + (matched.y2 - matched.y1) * ev.pluckT;
                    this._triggerVisualHit(matched, ev.note, ev.velocity * 0.85, ev.pluckT, hx, hy);
                  }
                }, delayMs);
              }
            }
          }
        }

        this.nextStepTime += secPer16th;
        this.currentStep += 1;
      }
    }

    _updateBeatDots(activeBeat) {
      document.querySelectorAll('.as-beat-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeBeat);
      });
    }

    updateLooperUI() {
      const recBtn = document.getElementById('as-loop-rec');
      const playBtn = document.getElementById('as-loop-play');
      const badge = document.getElementById('as-loop-badge');
      const pipsEl = document.getElementById('as-loop-pips');

      if (recBtn) {
        recBtn.classList.toggle('recording', this.loopState === 'recording' || this.loopState === 'overdub' || this.loopState === 'countin');
        if (this.loopState === 'countin') {
          recBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">timer</span>Count-In…';
        } else if (this.loopState === 'recording') {
          recBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">radio_button_checked</span>Recording';
        } else if (this.loopState === 'overdub') {
          recBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">layers</span>Overdub';
        } else if (this.loopState === 'playing') {
          recBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">add_circle</span>Overdub';
        } else {
          recBtn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">fiber_manual_record</span>Rec Loop';
        }
      }

      if (playBtn) {
        const isPlaying = this.loopState === 'playing' || this.loopState === 'recording' || this.loopState === 'overdub';
        playBtn.classList.toggle('active', isPlaying);
        playBtn.innerHTML = isPlaying
          ? '<span class="material-symbols-outlined" aria-hidden="true">stop</span>Stop'
          : '<span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>Play';
      }

      if (badge) {
        badge.textContent = `${this.loopEvents.length} notes`;
      }

      if (pipsEl) {
        const totalBeats = this.loopBars * 4;
        pipsEl.innerHTML = this.loopEvents
          .map((ev) => {
            const left = ((ev.beatOffset / totalBeats) * 100).toFixed(2);
            const col = (AudioLib.INSTRUMENTS[ev.instrument] || {}).color || '#00eefc';
            return `<span class="as-loop-pip" style="left:${left}%;background:${col}"></span>`;
          })
          .join('');
      }
    }

    // ── Instrument Rack Inspector ───────────────────────────────────────────
    renderRack() {
      if (this.rackCount) this.rackCount.textContent = String(this.items.length);
      if (!this.rackList) return;

      if (!this.items.length) {
        this.rackList.innerHTML =
          '<p class="as-rack-empty">Stage is empty. Switch to <strong>Draw</strong> mode (or press <code>2</code>) and drag on the canvas or pinch in mid-air to create glowing strings &amp; pads.</p>';
        return;
      }

      const instOptions = Object.values(AudioLib.INSTRUMENTS)
        .map((i) => `<option value="${i.id}">${i.label}</option>`)
        .join('');

      this.rackList.innerHTML = this.items
        .map((it, idx) => {
          const inst = AudioLib.INSTRUMENTS[it.instrument] || AudioLib.INSTRUMENTS.guitar;
          let voiceOptions = '';
          if (inst.kind === 'percussion') {
            voiceOptions = inst.voices
              .map((v) => `<option value="${v.id}" ${v.id === it.note ? 'selected' : ''}>${v.label}</option>`)
              .join('');
          } else if (inst.kind === 'chord') {
            voiceOptions = inst.voices
              .map((c) => `<option value="${c}" ${c === it.note ? 'selected' : ''}>${c}</option>`)
              .join('');
          } else {
            const allNotes = AudioLib.getScaleNotes('C', 'chromatic', 2, 5);
            voiceOptions = allNotes
              .map((n) => `<option value="${n}" ${n === it.note ? 'selected' : ''}>${n}</option>`)
              .join('');
          }

          return `
            <div class="as-rack-item ${it.id === this.selectedId ? 'selected' : ''}" data-item-id="${it.id}">
              <button type="button" class="as-rack-swatch" style="--swatch:${it.color}" title="Click to audition" aria-label="Audition item ${idx + 1}">
                <span class="material-symbols-outlined" aria-hidden="true">${it.shape === 'pad' ? 'radio_button_unchecked' : 'linear_scale'}</span>
              </button>
              <select class="as-rack-select as-rack-inst" aria-label="Instrument for item ${idx + 1}">
                ${instOptions.replace(`value="${it.instrument}"`, `value="${it.instrument}" selected`)}
              </select>
              <select class="as-rack-select as-rack-note" aria-label="Note or sound for item ${idx + 1}">
                ${voiceOptions}
              </select>
              <button type="button" class="as-rack-color" title="Cycle neon colour" aria-label="Change colour for item ${idx + 1}" style="background:${it.color}"></button>
              <button type="button" class="as-rack-del" title="Remove" aria-label="Remove item ${idx + 1}">
                <span class="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
          `;
        })
        .join('');

      this.rackList.querySelectorAll('.as-rack-item').forEach((row) => {
        const id = row.dataset.itemId;
        const item = this.items.find((x) => x.id === id);
        if (!item) return;

        row.querySelector('.as-rack-swatch').addEventListener('click', () => {
          this.selectedId = id;
          const hx = item.shape === 'pad' ? item.cx : (item.x1 + item.x2) * 0.5;
          const hy = item.shape === 'pad' ? item.cy : (item.y1 + item.y2) * 0.5;
          this.triggerItem(item, 0.85, 0.5, hx, hy, false);
          this.renderRack();
        });

        row.querySelector('.as-rack-inst').addEventListener('change', (e) => {
          item.instrument = e.target.value;
          const inst = AudioLib.INSTRUMENTS[item.instrument];
          item.color = inst.color;
          const len = item.shape === 'pad' ? item.r * 3.5 : Math.hypot(item.x2 - item.x1, item.y2 - item.y1);
          item.note = AudioLib.lengthToNote(len, item.instrument, this.key, this.scale);
          item.lastHitNote = item.note;
          this.audio.trigger(item.instrument, item.note, 0.78, 0.5);
          this.renderRack();
        });

        row.querySelector('.as-rack-note').addEventListener('change', (e) => {
          item.note = e.target.value;
          item.lastHitNote = item.note;
          this.audio.trigger(item.instrument, item.note, 0.78, 0.5);
        });

        row.querySelector('.as-rack-color').addEventListener('click', () => {
          const i = NEON_COLORS.indexOf(item.color);
          item.color = NEON_COLORS[(i + 1) % NEON_COLORS.length];
          this.renderRack();
        });

        row.querySelector('.as-rack-del').addEventListener('click', () => {
          this.deleteItem(id);
        });
      });
    }

    // ── Main 60 FPS Render Loop ─────────────────────────────────────────────
    startRenderLoop() {
      const step = () => {
        this._detectHandsFrame();
        this._renderFrame();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    _getCvSourceFrame() {
      // On mobile (or CPU delegate), copy the live video onto a compact 2D canvas.
      // This bakes in Android portrait orientation, avoids raw SurfaceTexture glitches,
      // and makes CPU inference 4-5x faster.
      if (!this.isMobile && this._handDelegate === 'GPU') {
        return this.video;
      }
      const vw = this.video.videoWidth || 640;
      const vh = this.video.videoHeight || 480;
      const maxDim = 320;
      const scale = Math.min(1, maxDim / Math.max(vw, vh));
      const cw = Math.max(64, Math.round(vw * scale));
      const ch = Math.max(64, Math.round(vh * scale));
      if (this._cvCanvas.width !== cw || this._cvCanvas.height !== ch) {
        this._cvCanvas.width = cw;
        this._cvCanvas.height = ch;
      }
      this._cvCtx.drawImage(this.video, 0, 0, cw, ch);
      return this._cvCanvas;
    }

    _detectHandsFrame() {
      if (
        !this.cameraActive ||
        !this.handLandmarker ||
        this._switchingToCpu ||
        !this.video ||
        this.video.readyState < 2 ||
        !this.video.videoWidth ||
        !this.video.videoHeight
      ) {
        return;
      }

      const vt = this.video.currentTime;
      const nowWall = performance.now();
      const minInterval = this.isMobile ? 45 : 34;
      // Some Android browsers don't advance video.currentTime reliably on live streams,
      // so also trigger on wall-clock interval (and throttle CPU mobile to ~22 FPS).
      const shouldRun = this.isMobile
        ? nowWall - this._lastDetectWallMs >= minInterval
        : vt !== this.lastVideoTime || nowWall - this._lastDetectWallMs >= minInterval;

      if (shouldRun) {
        this.lastVideoTime = vt;
        this._lastDetectWallMs = nowWall;
        const nowMs = Math.max(this._lastCvTs + 1, nowWall);
        this._lastCvTs = nowMs;
        const cvSource = this._getCvSourceFrame();

        try {
          const res = this.handLandmarker.detectForVideo(cvSource, nowMs);
          this._handErrorCount = 0;
          this.latestHands = res && res.landmarks ? res.landmarks : [];
          this._processHandLandmarks(this.latestHands);

          if (this.latestHands.length !== this._lastReportedHands) {
            this._lastReportedHands = this.latestHands.length;
            const n = this.latestHands.length;
            this.setStatus(
              n > 0
                ? `Tracking live · ${n} ${n === 1 ? 'hand' : 'hands'} detected`
                : 'Tracking live — hold your hands in view to play!',
              'live'
            );
          }
        } catch (err) {
          this._handErrorCount += 1;
          console.warn('HandLandmarker frame error:', err);
          if (this._handDelegate === 'GPU' && this._handErrorCount >= 2) {
            this._switchingToCpu = true;
            this.setStatus('Switching hand tracking to CPU mode…', 'loading');
            this._initHandLandmarker('CPU')
              .then(() => {
                if (this.cameraActive) {
                  this.setStatus('Tracking live (CPU mode) — wave your hands to play!', 'live');
                }
              })
              .catch((e) => {
                console.error('CPU fallback failed:', e);
                this.setStatus('Hand tracking unsupported on this browser — use Touch Play!', 'error');
              })
              .finally(() => {
                this._switchingToCpu = false;
              });
          }
        }

        if (this.bgMode !== 'none' && this.imageSegmenter) {
          this._segmentPersonFrame(cvSource, nowMs);
        }
      }
    }

    _segmentPersonFrame(cvSource, nowMs) {
      let segRes = null;
      try {
        segRes = this.imageSegmenter.segmentForVideo(cvSource, nowMs);
        const masks = segRes && segRes.confidenceMasks;
        if (!masks || !masks.length) return;

        // Single-channel selfie_segmenter outputs foreground person probability at index 0;
        // multi-class models output background at 0 and person at 1.
        const personMask = masks.length > 1 ? masks[1] : masks[0];
        const mw = personMask.width;
        const mh = personMask.height;
        const floatData = personMask.getAsFloat32Array();

        if (this._maskCanvas.width !== mw || this._maskCanvas.height !== mh) {
          this._maskCanvas.width = mw;
          this._maskCanvas.height = mh;
          this._maskImgData = this._maskCtx.createImageData(mw, mh);
        }

        const pixels = this._maskImgData.data;
        const len = floatData.length;
        for (let i = 0; i < len; i++) {
          const v = floatData[i];
          // Smoothstep alpha edge [0.22 .. 0.78] for clean hair & fingers without jagged cutouts
          let a = 0;
          if (v >= 0.78) a = 255;
          else if (v > 0.22) a = ((v - 0.22) * 455.35) | 0;
          const p = i << 2;
          pixels[p] = 255;
          pixels[p + 1] = 255;
          pixels[p + 2] = 255;
          pixels[p + 3] = a;
        }
        this._maskCtx.putImageData(this._maskImgData, 0, 0);
        this.hasMask = true;
      } catch (_) {
        // Ignore transient frame errors
      } finally {
        if (segRes) {
          try {
            if (segRes.confidenceMasks) {
              segRes.confidenceMasks.forEach((m) => m && typeof m.close === 'function' && m.close());
            }
            if (typeof segRes.close === 'function') segRes.close();
          } catch (_) {}
        }
      }
    }

    _drawCyberGridBg(ctx, W, H) {
      const grad = ctx.createRadialGradient(W * 0.5, H * 0.45, 20, W * 0.5, H * 0.5, W * 0.72);
      grad.addColorStop(0, '#181826');
      grad.addColorStop(1, '#0b0b12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(0, 238, 252, 0.055)';
      ctx.lineWidth = 1;
      const grid = 44;
      for (let x = grid; x < W; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = grid; y < H; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    _drawWebcamLayer(ctx, W, H) {
      const rect = this._getVideoRect(W, H);
      const { dx, dy, dw, dh, mirrored } = rect;

      // Normal clear webcam OR while segmenter is still warming up
      if (this.bgMode === 'none' || !this.hasMask) {
        ctx.save();
        if (mirrored) {
          ctx.translate(W, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(this.video, dx, dy, dw, dh);
        ctx.restore();
        return;
      }

      // 1. Draw Background (Blurred room OR Cyber Studio grid)
      if (this.bgMode === 'cyber-bg') {
        this._drawCyberGridBg(ctx, W, H);
      } else {
        const blurPx = this.bgMode === 'blur-heavy' ? 22 : 10;
        const pad = blurPx * 1.4;
        ctx.save();
        if (mirrored) {
          ctx.translate(W, 0);
          ctx.scale(-1, 1);
        }
        ctx.filter = `blur(${blurPx}px)`;
        ctx.drawImage(this.video, dx - pad, dy - pad, dw + pad * 2, dh + pad * 2);
        ctx.filter = 'none';
        ctx.restore();
      }

      // 2. Composite crisp foreground person + hands using offscreen canvas
      const pw = Math.round(W);
      const ph = Math.round(H);
      if (this._personCanvas.width !== pw || this._personCanvas.height !== ph) {
        this._personCanvas.width = pw;
        this._personCanvas.height = ph;
      }
      const pctx = this._personCtx;
      pctx.save();
      pctx.clearRect(0, 0, pw, ph);
      pctx.globalCompositeOperation = 'source-over';
      if (mirrored) {
        pctx.translate(pw, 0);
        pctx.scale(-1, 1);
      }
      pctx.drawImage(this.video, dx, dy, dw, dh);

      // Mask foreground with softly feathered confidence alpha
      pctx.globalCompositeOperation = 'destination-in';
      pctx.filter = 'blur(2px)';
      pctx.drawImage(this._maskCanvas, dx, dy, dw, dh);
      pctx.filter = 'none';
      pctx.restore();

      // 3. Draw sharp person cutout over blurred/cyber background
      ctx.drawImage(this._personCanvas, 0, 0, W, H);
    }

    _renderFrame() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const W = this.viewW;
      const H = this.viewH;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);

      // 1. Background: Mirrored Webcam (with optional Zoom-style blur / Cyber Studio) OR Dark Cyber-Grid Stage
      if (this.cameraActive && this.video && this.video.readyState >= 2) {
        this._drawWebcamLayer(ctx, W, H);

        if (this.videoDimmer > 0) {
          ctx.fillStyle = `rgba(10, 10, 18, ${this.videoDimmer.toFixed(2)})`;
          ctx.fillRect(0, 0, W, H);
        }
      } else {
        this._drawCyberGridBg(ctx, W, H);
      }

      // Subtle beat pulse border glow
      if (this.beatPulse > 0.01) {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 238, 252, ${(this.beatPulse * 0.45).toFixed(3)})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, W - 6, H - 6);
        ctx.restore();
        this.beatPulse *= 0.88;
      }

      // 2. Render Neon Strings & Air Pads
      for (const it of this.items) {
        if (it.shape === 'string') {
          this._drawNeonString(ctx, it, W, H);
        } else {
          this._drawAirPad(ctx, it, W, H);
        }
      }

      // 3. Render Live Draft Preview (Mouse Draw OR Air-Pinch Draw)
      if (this.mode === 'draw') {
        if (this.mouseDraw) {
          this._drawDraftPreview(ctx, this.mouseDraw, W, H);
        } else if (this.twoHandDraw) {
          this._drawDraftPreview(ctx, this.twoHandDraw, W, H);
        } else {
          for (let h = 0; h < 2; h++) {
            if (this.handPinch[h].active) {
              this._drawDraftPreview(
                ctx,
                {
                  shape: this.drawShape,
                  x1: this.handPinch[h].startX,
                  y1: this.handPinch[h].startY,
                  x2: this.handPinch[h].x,
                  y2: this.handPinch[h].y,
                },
                W,
                H
              );
            }
          }
        }
      }

      // 4. Render Expanding Shockwave Ripples
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const rp = this.ripples[i];
        rp.r += (rp.maxR - rp.r) * 0.16;
        rp.alpha -= 0.045;
        if (rp.alpha <= 0) {
          this.ripples.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = rp.color;
        ctx.globalAlpha = rp.alpha;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = rp.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 5. Render Spark Particles
      for (let i = this.sparks.length - 1; i >= 0; i--) {
        const sp = this.sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy = sp.vy * 0.96 + 0.07;
        sp.life -= sp.decay;
        if (sp.life <= 0) {
          this.sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = sp.life;
        ctx.strokeStyle = sp.color;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = sp.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x - sp.vx * 2.2, sp.y - sp.vy * 2.2);
        ctx.stroke();
        ctx.restore();
      }

      // 6. Render Hand Tracking Skeletons (exact screenshot aesthetic!)
      if (this.latestHands.length) {
        this._drawHands(ctx, this.latestHands, W, H);
      }

      // 7. HUD Overlays (Active note hit banner + Count-in / Loop Progress Bar)
      if (this.hitBanner.alpha > 0.02) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.hitBanner.alpha);
        ctx.font = '800 13px "Space Grotesk", sans-serif';
        const txt = this.hitBanner.text;
        const tw = ctx.measureText(txt).width + 24;
        ctx.fillStyle = 'rgba(14, 14, 22, 0.78)';
        ctx.strokeStyle = this.hitBanner.color;
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, 16, 16, tw, 30, 15);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8f5fd';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, 28, 31);
        ctx.restore();
        this.hitBanner.alpha -= 0.022;
      }

      if (this.loopState === 'countin') {
        ctx.save();
        ctx.fillStyle = 'rgba(14, 14, 22, 0.55)';
        ctx.fillRect(0, 0, W, H);
        ctx.font = '900 72px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#00eefc';
        ctx.shadowColor = '#00eefc';
        ctx.shadowBlur = 28;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(Math.max(1, this.countInBeatsLeft)), W * 0.5, H * 0.5);
        ctx.font = '700 16px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#f8f5fd';
        ctx.shadowBlur = 0;
        ctx.fillText('GET READY TO PLAY…', W * 0.5, H * 0.5 + 54);
        ctx.restore();
      }

      // Update live loop playhead bar in DOM
      if (
        this.transportRunning &&
        this.audio.ctx &&
        (this.loopState === 'recording' || this.loopState === 'playing' || this.loopState === 'overdub')
      ) {
        const loopDurSec = this.loopBars * 4 * (60 / this.bpm);
        const pct = (((this.audio.ctx.currentTime - this.loopStartTime) % loopDurSec) + loopDurSec) % loopDurSec / loopDurSec;
        const fill = document.getElementById('as-loop-playhead');
        if (fill) fill.style.width = (pct * 100).toFixed(1) + '%';
      }

      ctx.restore();
    }

    _drawNeonString(ctx, it, W, H) {
      const x1 = it.x1 * W;
      const y1 = it.y1 * H;
      const x2 = it.x2 * W;
      const y2 = it.y2 * H;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      // Decay vibration & flash
      if (it.vibAmp > 0.08) {
        it.vibPhase += 0.68;
        it.vibAmp *= 0.915;
      } else {
        it.vibAmp = 0;
      }
      if (it.flash > 0.01) it.flash *= 0.89;
      else it.flash = 0;

      const disp = Math.sin(it.vibPhase) * it.vibAmp;
      const segments = 24;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Standing wave envelope centered near pluckT
        const env = Math.sin(t * Math.PI) * (0.7 + 0.3 * Math.cos((t - it.pluckT) * Math.PI));
        const d = disp * env;
        pts.push({
          x: x1 + dx * t + nx * d,
          y: y1 + dy * t + ny * d,
        });
      }

      const isSelected = it.id === this.selectedId;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Outer plasma glow pass
      ctx.strokeStyle = it.color;
      ctx.shadowColor = it.color;
      ctx.shadowBlur = 16 + it.flash * 22;
      ctx.lineWidth = (isSelected ? 7.5 : 5.2) + it.flash * 4.5;
      ctx.globalAlpha = 0.5 + it.flash * 0.45;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      // Secondary vibrating ghost harmonic filament when plucked
      if (it.vibAmp > 1.2) {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const d = -disp * 0.6 * Math.sin(t * Math.PI);
          const gx = x1 + dx * t + nx * d;
          const gy = y1 + dy * t + ny * d;
          if (i === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.stroke();
      }

      // Bright white-hot core filament
      ctx.globalAlpha = 0.92;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.8 + it.flash * 1.4;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();

      // Perpendicular fret / harmonic tick marks (signature look from screenshot!)
      const tickCount = Math.max(5, Math.min(13, Math.round(len / 42)));
      ctx.strokeStyle = it.color;
      ctx.globalAlpha = 0.72 + it.flash * 0.25;
      ctx.lineWidth = 1.4;
      ctx.shadowBlur = 6;
      for (let k = 1; k < tickCount; k++) {
        const t = k / tickCount;
        const idx = Math.round(t * segments);
        const p = pts[idx];
        const tickLen = this.fretboardMode ? 9 : 6.5;
        ctx.beginPath();
        ctx.moveTo(p.x - nx * tickLen, p.y - ny * tickLen);
        ctx.lineTo(p.x + nx * tickLen, p.y + ny * tickLen);
        ctx.stroke();
      }

      // Crosshair Anchor Pins at both ends (exact screenshot detail!)
      this._drawAnchorPin(ctx, x1, y1, it.color, isSelected || this.mode === 'edit');
      this._drawAnchorPin(ctx, x2, y2, it.color, isSelected || this.mode === 'edit');

      // Micro note/instrument badge near anchor A
      if (this.showLabels) {
        const label = AudioLib.getDisplayLabel(it.instrument, it.lastHitNote || it.note);
        ctx.globalAlpha = 0.88;
        ctx.shadowBlur = 0;
        ctx.font = '700 10.5px "Space Grotesk", sans-serif';
        const tw = ctx.measureText(label).width + 12;
        const bx = x1 + nx * 16 - tw * 0.5;
        const by = y1 + ny * 16 - 9;
        ctx.fillStyle = 'rgba(12, 12, 20, 0.78)';
        ctx.strokeStyle = it.color;
        ctx.lineWidth = 1;
        this._roundRect(ctx, Math.max(6, Math.min(W - tw - 6, bx)), Math.max(6, Math.min(H - 22, by)), tw, 18, 9);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8f5fd';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          label,
          Math.max(6, Math.min(W - tw - 6, bx)) + tw * 0.5,
          Math.max(6, Math.min(H - 22, by)) + 9.5
        );
      }

      ctx.restore();
    }

    _drawAnchorPin(ctx, x, y, color, large) {
      const r = large ? 7.5 : 5;
      const cross = large ? 13 : 9.5;
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - cross, y);
      ctx.lineTo(x + cross, y);
      ctx.moveTo(x, y - cross);
      ctx.lineTo(x, y + cross);
      ctx.stroke();
      ctx.restore();
    }

    _drawAirPad(ctx, it, W, H) {
      const cx = it.cx * W;
      const cy = it.cy * H;
      const r = it.r * Math.min(W, H);

      if (it.flash > 0.01) it.flash *= 0.87;
      else it.flash = 0;

      const isSelected = it.id === this.selectedId;
      const pulseR = r * (1 + it.flash * 0.14);

      ctx.save();
      // Soft glowing translucent drum skin fill
      const rad = ctx.createRadialGradient(cx, cy, 4, cx, cy, pulseR);
      rad.addColorStop(0, `rgba(255,255,255,${(0.08 + it.flash * 0.34).toFixed(2)})`);
      rad.addColorStop(0.75, 'rgba(14,14,24,0.28)');
      rad.addColorStop(1, 'rgba(14,14,24,0.05)');
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fill();

      // Outer neon hoop
      ctx.strokeStyle = it.color;
      ctx.shadowColor = it.color;
      ctx.shadowBlur = 14 + it.flash * 22;
      ctx.lineWidth = (isSelected ? 4.2 : 2.8) + it.flash * 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      // Inner crisp white dashed harmonic ring
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR * 0.74, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4 perimeter tick notches
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      for (let a = 0; a < 4; a++) {
        const ang = (a * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * (pulseR - 5), cy + Math.sin(ang) * (pulseR - 5));
        ctx.lineTo(cx + Math.cos(ang) * (pulseR + 5), cy + Math.sin(ang) * (pulseR + 5));
        ctx.stroke();
      }

      if (this.showLabels) {
        const label = AudioLib.getDisplayLabel(it.instrument, it.note);
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 11px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, cx, cy);
      }

      ctx.restore();
    }

    _drawDraftPreview(ctx, draft, W, H) {
      const inst = AudioLib.INSTRUMENTS[this.drawInstrument] || AudioLib.INSTRUMENTS.guitar;
      const color = this.drawColor === 'auto' ? inst.color : this.drawColor;
      const x1 = draft.x1 * W;
      const y1 = draft.y1 * H;
      const x2 = draft.x2 * W;
      const y2 = draft.y2 * H;
      const dist = Math.hypot(draft.x2 - draft.x1, draft.y2 - draft.y1);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);

      let previewNote;
      if (draft.shape === 'pad') {
        const r = Math.max(0.055, Math.min(0.14, dist > 0.03 ? dist : 0.072));
        previewNote = AudioLib.lengthToNote(r * 3.5, this.drawInstrument, this.key, this.scale);
        ctx.beginPath();
        ctx.arc(x1, y1, r * Math.min(W, H), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        previewNote = AudioLib.lengthToNote(Math.max(0.08, dist), this.drawInstrument, this.key, this.scale);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        this._drawAnchorPin(ctx, x1, y1, color, true);
        this._drawAnchorPin(ctx, x2, y2, color, true);
      }

      ctx.setLineDash([]);
      const badge = `${inst.label.toUpperCase()} · ${AudioLib.getDisplayLabel(this.drawInstrument, previewNote)}`;
      ctx.font = '800 12px "Space Grotesk", sans-serif';
      const tw = ctx.measureText(badge).width + 18;
      const mx = (x1 + x2) * 0.5;
      const my = (y1 + y2) * 0.5 - 20;
      ctx.fillStyle = 'rgba(14, 14, 22, 0.88)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      this._roundRect(ctx, mx - tw * 0.5, my - 12, tw, 24, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badge, mx, my);
      ctx.restore();
    }

    _drawHands(ctx, hands, W, H) {
      const activeTips = this.fingerMode === 'index' ? INDEX_ONLY : ALL_FINGERTIPS;
      const rect = this._getVideoRect(W, H);

      hands.forEach((lm, hIdx) => {
        const pts = lm.map((p) => {
          const n = this._mapLandmarkNorm(p, rect, W, H);
          return { x: n.x * W, y: n.y * H };
        });

        const isMono = this.handStyle === 'mono';
        const boneColor = isMono
          ? '#09090d'
          : this.handStyle === 'classic'
          ? '#22ff55'
          : this.handStyle === 'cyber'
          ? hIdx === 0
            ? '#00eefc'
            : '#ff007f'
          : null;
        const dotColor = isMono
          ? '#ffffff'
          : this.handStyle === 'classic'
          ? '#ff1e3c'
          : this.handStyle === 'cyber'
          ? '#ffffff'
          : null;

        ctx.save();
        // Skeleton bones
        if (boneColor) {
          ctx.strokeStyle = boneColor;
          ctx.shadowColor = isMono ? 'rgba(255, 255, 255, 0.35)' : boneColor;
          ctx.shadowBlur = isMono ? 4 : 10;
          ctx.lineWidth = isMono ? 3.5 : 3.2;
          ctx.lineCap = 'round';
          for (const [a, b] of HAND_CONNECTIONS) {
            ctx.beginPath();
            ctx.moveTo(pts[a].x, pts[a].y);
            ctx.lineTo(pts[b].x, pts[b].y);
            ctx.stroke();
          }
        }

        // Joint landmark dots
        if (dotColor) {
          ctx.shadowColor = isMono ? 'rgba(0, 0, 0, 0.65)' : dotColor;
          ctx.shadowBlur = isMono ? 4 : 6;
          ctx.fillStyle = dotColor;
          ctx.strokeStyle = '#09090d';
          ctx.lineWidth = 1.4;
          for (let i = 0; i < pts.length; i++) {
            ctx.beginPath();
            ctx.arc(pts[i].x, pts[i].y, isMono ? 4.6 : 4.2, 0, Math.PI * 2);
            ctx.fill();
            if (isMono) ctx.stroke();
          }
        }

        // White glowing rings on active strumming fingertips
        for (const tipIdx of activeTips) {
          const p = pts[tipIdx];
          ctx.strokeStyle = '#ffffff';
          ctx.shadowColor = isMono ? 'rgba(0, 0, 0, 0.8)' : '#00eefc';
          ctx.shadowBlur = isMono ? 6 : 12;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Pinch indicator halo when in Draw Mode
        if (this.mode === 'draw' && this.handPinch[hIdx] && this.handPinch[hIdx].active) {
          const px = this.handPinch[hIdx].x * W;
          const py = this.handPinch[hIdx].y * H;
          ctx.strokeStyle = '#a3ff12';
          ctx.shadowColor = '#a3ff12';
          ctx.shadowBlur = 18;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(px, py, 16, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });
    }

    _roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.__airStringsApp = new AirStringsApp();
  });
})();
